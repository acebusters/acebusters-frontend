import React from 'react';
import { createStructuredSelector } from 'reselect';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedDate, FormattedTime } from 'react-intl';
import { getWeb3 } from '../../containers/AccountProvider/utils';

import { ABI_TABLE } from '../../app.config';

import { makeHandsSelector, makeLatestHandSelector } from '../Table/selectors';

import { loadContractData } from './loadContractData';
import { parseLastReceiptAmount, parseDistributionReceipt, renderNtz } from './utils';

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

  tfoot tr:first-child {
    border-top: 1px solid #ccc;
  }
`;

window.enableTableDebug = () => null;
window.disableTableDebug = () => null;

class TableDebug extends React.Component {

  constructor(props) {
    super(props);

    const visible = !!JSON.parse(localStorage.getItem('table_debug_enabled') || 'false');

    this.state = {
      data: null,
      contractData: null,
      visible,
      expanded: false,
    };

    this.table = getWeb3().eth.contract(ABI_TABLE).at(props.contract.address);

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
    loadContractData(this.table).then((contractData) => {
      this.setState({ contractData });
    });
  }

  renderContractData(contractData) {
    const lastNettingRequestTime = new Date(contractData.lastNettingRequestTime * 1000);

    return (
      <div>
        <ul>
          <li>
            <strong>lastHandNetted: </strong>
            {contractData.lastHandNetted.toString()}
          </li>
          <li>
            <strong>lastNettingRequestHandId: </strong>
            {contractData.lastNettingRequestHandId.toString()}
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
                    {renderNtz(contractData.hands[handId].ins[i])}
                  </td>,
                  <td key={(i * 2) + 1}>
                    {renderNtz(contractData.hands[handId].outs[i] &&
                      contractData.hands[handId].outs[i].out)}
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
                <td key={i} colSpan={2}>{seat.exitHand && seat.exitHand.toString()}</td>)}
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }

  renderDbHands(hands) {
    const dists = hands.map((hand) => parseDistributionReceipt(hand.distribution, hand.lineup));

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

  renderData(hands, contractData) {
    if (!hands && !contractData) {
      return null;
    }

    return (
      <div>
        <Columns>
          {contractData &&
            <Column>
              <h2>Contract</h2>
              {this.renderContractData(contractData)}
            </Column>
          }
          {hands &&
            <Column>
              <h2>Db</h2>
              {this.renderDbHands(hands)}
            </Column>
          }
        </Columns>
      </div>
    );
  }

  render() {
    const { visible, expanded, contractData } = this.state;
    const { hands, latestHand } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <Wrapper>
        <button onClick={this.handleExpandedToggle}>
          {expanded ? 'close' : 'open debug pane' }
        </button>
        Hand: {latestHand}
        {expanded &&
          <div>
            <button onClick={this.handleRefresh}>
              refresh
            </button>
            <hr />

            {this.renderData(hands, contractData)}
          </div>
        }
      </Wrapper>
    );
  }

}

TableDebug.propTypes = {
  contract: PropTypes.object.isRequired,
  hands: PropTypes.array.isRequired,
  latestHand: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  hands: makeHandsSelector(),
  latestHand: makeLatestHandSelector(),
});

export default connect(mapStateToProps)(TableDebug);
