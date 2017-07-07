import React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import EWT from 'ethereum-web-token';
import { FormattedDate, FormattedTime } from 'react-intl';

import { formatNtz } from '../../utils/amountFormater';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  
  overflow: auto;
  width: 80%;
  max-height: 100vh;
  padding: 10px;

  opacity: 0.4;

  color: #000;
  background-color: #FFF;

  &:hover {
    opacity: 1;
  }
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Column = styled.div`
  flex: 1;
  margin-right: 30px;
`;

const Table = styled.table`
  th, td {
    text-align: left;
  }

  th {
    padding: 0 10px;
  }

  td {
    padding: 5px 10px;
    white-space: nowrap;
  }

  tbody tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
  }

  tbody td:nth-child(2n + 1):not(:last-child),
  tbody th {
    border-right: 1px solid #ccc;
  }
`;

window.enableTableDebug = () => null;
window.disableTableDebug = () => null;

export default class TableDebug extends React.Component {

  constructor(props) {
    super(props);

    const visible = !!JSON.parse(localStorage.getItem('table_debug_enabled') || 'false');

    this.state = {
      data: null,
      visible,
      expanded: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleExpandedToggle = this.handleExpandedToggle.bind(this);

    const events = props.contract.allEvents({ to: 'latest' });
    window.enableTableDebug = () => {
      this.setState({ visible: true, expanded: true });
      localStorage.setItem('table_debug_enabled', true);
      this.handleRefresh();
      events.watch(() => this.handleRefresh());
    };

    if (visible) {
      this.handleRefresh();
      events.watch(() => this.handleRefresh());
    }

    window.disableTableDebug = () => {
      this.setState({ visible: false });
      localStorage.setItem('table_debug_enabled', false);
      events.stopWatching(() => null);
    };
  }

  componentWillUnmount() {
    window.enableTableDebug = () => null;
    window.disableTableDebug = () => null;
  }

  handleExpandedToggle() {
    this.setState((state) => ({ expanded: !state.expanded }));
  }

  handleRefresh() {
    const { tableService } = this.props;
    tableService.debug().then((response) => {
      this.setState({
        data: response,
      });
    });
  }

  renderContractData(contractData) {
    const lastNettingRequestTime = new Date(contractData.lastNettingRequestTime * 1000);
    return (
      <div>
        <ul>
          <li>
            <strong>lastHandNetted: </strong>
            {contractData.lastHandNetted}
          </li>
          <li>
            <strong>lastNettingRequestHandId: </strong>
            {contractData.lastNettingRequestHandId}
          </li>
          <li>
            <strong>lastNettingRequestTime: </strong>
            <FormattedDate value={lastNettingRequestTime} />, <FormattedTime value={lastNettingRequestTime} />
          </li>
        </ul>
        <Table>
          <thead>
            <tr>
              <th>Hand Id</th>
              {contractData.lineup.map((_, i) =>
                <th key={i} colSpan={2}>Seat {i}</th>)}
            </tr>
            <tr>
              <th></th>
              {contractData.lineup.reduce((memo, _, i) => memo.concat([
                <th key={i * 2}>In</th>,
                <th key={(i * 2) + 1}>Out</th>,
              ]), [])}
            </tr>
          </thead>
          <tbody>
            {Object.keys(contractData.hands).map((handId) => (
              <tr key={handId}>
                <td>{handId}</td>
                {contractData.lineup.reduce((memo, _, i) => memo.concat([
                  <td key={i * 2}>
                    {contractData.hands[handId].ins[i]}
                  </td>,
                  <td key={(i * 2) + 1}>
                    {contractData.hands[handId].outs[i] &&
                      contractData.hands[handId].outs[i].out}
                  </td>,
                ]), [])}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Bal.</th>
              {contractData.lineup.map((seat, i) =>
                <td key={i} colSpan={2}>{renderNtz(seat.amount)}</td>)}
            </tr>
            <tr>
              <th>Exit hand</th>
              {contractData.lineup.map((seat, i) =>
                <td key={i} colSpan={2}>{renderNtz(seat.exitHand)}</td>)}
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }

  renderDbHands(hands) {
    const dists = hands.map((hand) => parseDistribution(hand.distribution));

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Hand Id</th>
              {hands[0].lineup.map((_, j) =>
                <th key={j} colSpan={2}>Seat {j}</th>
              )}
            </tr>
            <tr>
              <td />
              {hands[0].lineup.reduce((memo, seat, j) => memo.concat([
                <th key={j * 2}>
                  Bet
                </th>,
                <th key={(j * 2) + 1}>
                  Dist
                </th>,
              ]), [])}
            </tr>
          </thead>
          <tbody>
            {hands.map((hand, i) => (
              <tr key={hand.handId}>
                <th>{hand.handId}</th>
                {hand.lineup.reduce((memo, seat, j) => memo.concat([
                  <td key={j * 2}>
                    {renderNtz(parseLastReceiptAmount(seat.last))}
                  </td>,
                  <td key={(j * 2) + 1}>
                    {dists[i] && renderNtz(dists[i][seat.address])}
                  </td>,
                ]), [])}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Exit hand</th>
              {hands[0].lineup.map((seat, j) =>
                <td key={j} colSpan={2}>{seat.exitHand}</td>
              )}
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }

  renderData(data) {
    if (!data) {
      return null;
    }

    return (
      <div>

        <Columns>
          <Column>
            <h2>Contract</h2>
            {this.renderContractData(data.contract)}
          </Column>
          <Column>
            <h2>Db</h2>
            {this.renderDbHands(data.db)}
          </Column>
        </Columns>
      </div>
    );
  }

  render() {
    const { visible, expanded, data } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <Wrapper>
        <button onClick={this.handleExpandedToggle}>
          {expanded ? 'close' : 'open debug pane' }
        </button>
        {expanded &&
          <div>
            <button onClick={this.handleRefresh}>
              refresh
            </button>
            <hr />

            {this.renderData(data)}
          </div>
        }
      </Wrapper>
    );
  }

}

TableDebug.propTypes = {
  contract: PropTypes.object.isRequired,
  tableService: PropTypes.object.isRequired,
};

function parseDistribution(distribution) {
  if (!distribution) {
    return {};
  }

  const { values } = EWT.parse(distribution);
  const lineup = values[2];

  return lineup.reduce((memo, seat) => {
    const signerAddr = `0x${seat.slice(0, 40)}`;
    const amount = parseInt(seat.slice(40), 16);

    return {
      ...memo,
      [signerAddr]: amount,
    };
  }, {});
}

function parseLastReceiptAmount(receipt) {
  if (!receipt) {
    return null;
  }

  const { values } = EWT.parse(receipt);

  return values[1];
}

function renderNtz(amount) {
  if (amount) {
    return `${formatNtz(amount, 1)} NTZ`;
  }

  return (amount === null || amount === undefined) ? '-' : amount;
}
