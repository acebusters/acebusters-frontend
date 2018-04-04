import React from 'react';
import { createStructuredSelector } from 'reselect';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Receipt } from 'poker-helper';
import { getWeb3 } from '../../containers/AccountProvider/utils';

import { ABI_TABLE, conf } from '../../app.config';

import { makeHandsSelector, makeLatestHandSelector } from '../Table/selectors';
import A from '../../components/A';

import { loadContractData } from './loadContractData';
import { requestStat } from './requestStat';
import { parseDistributionReceipt, receiptStringType, renderNtz } from './utils';
import { Wrapper, Column, Columns, Table, ExtraDetail } from './styles';

window.enableTableDebug = () => null;
window.disableTableDebug = () => null;

class TableDebug extends React.Component {

  constructor(props) {
    super(props);

    const visible = !!JSON.parse(localStorage.getItem('table_debug_enabled') || 'false');

    this.state = {
      data: null,
      contractData: null,
      gasStat: null,
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
      events.watch(() => this.refreshContractData());
    };

    if (visible) {
      this.handleRefresh();
      events.watch(() => this.refreshContractData());
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
    this.refreshContractData();
    this.refreshGasStat();
  }

  refreshContractData() {
    loadContractData(this.table).then((contractData) => {
      this.setState({ contractData });
    });
  }

  refreshGasStat() {
    requestStat().then((gasStat) => {
      this.setState({ gasStat });
    });
  }

  renderContractData(contractData) {
    const lastNettingRequestTime = new Date(contractData.lastNettingRequestTime * 1000);

    return (
      <div>
        <ul>
          <li>
            <strong>Blind structure: </strong>
            {contractData.blindStructure.join(', ')}
          </li>
          <li>
            <strong>Blind level duration: </strong>
            {contractData.blindLevelDuration} sec
          </li>
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
              {contractData.lineup.map(({ address }, i) =>
                <th key={i} colSpan={2} title={address}>Seat {i}</th>)}
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
        <Table headerColumns={3} columns={3}>
          <thead>
            <tr>
              <th>Hand</th>
              <th>SB</th>
              <th>Start</th>
              {hands[0].lineup.map(({ address }, j) =>
                <th key={j} colSpan={3} title={address}>Seat {j}</th>
              )}
            </tr>
            <tr>
              <td />
              <td />
              <td />
              {hands[0].lineup.reduce((memo, seat, j) => memo.concat([
                <th key={j * 3}>
                  Bet
                </th>,
                <th key={(j * 3) + 1}>
                  Dist
                </th>,
                <th key={(j * 3) + 2} title="Exit hand">
                  Ext
                </th>,
              ]), [])}
            </tr>
          </thead>
          <tbody>
            {hands.map((hand, i) => (
              <tr key={hand.handId}>
                <th>
                  {hand.handId}
                  <ExtraDetail>{hand.state}</ExtraDetail>
                </th>
                <th>{renderNtz(hand.sb)}</th>
                <th>{hand.started && <FormattedTime value={hand.started * 1000} />}</th>
                {hand.lineup.reduce((memo, seat, j) => {
                  const receipt = seat.last && Receipt.parse(seat.last);
                  return memo.concat([
                    <td key={j * 3}>
                      {renderNtz(receipt && receipt.amount)}
                      {receipt &&
                        <ExtraDetail>
                          {receiptStringType(receipt.type)}
                        </ExtraDetail>
                      }
                    </td>,
                    <td key={(j * 3) + 1}>
                      {dists[i] && renderNtz(dists[i][seat.address])}
                    </td>,
                    <td key={(j * 3) + 2}>
                      {seat.exitHand}
                    </td>,
                  ]);
                }, [])}
              </tr>
            ))}
          </tbody>
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

  renderGasStat(stat) {
    if (!stat) {
      return null;
    }

    return (
      <div>
        <h2>Gas usage</h2>
        <Table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Hands count</th>
              <th>gas/hand (ETH)</th>
              <th>gas/hand/player (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stat).map((tableAddr) => (
              <tr key={tableAddr}>
                <td
                  style={{
                    fontWeight: this.table.address === tableAddr ? 'bold' : 'normal',
                  }}
                >
                  {tableAddr.slice(2, 8)}
                </td>
                <td>{stat[tableAddr].handsCount}</td>
                <td>{stat[tableAddr].hand}</td>
                <td>{stat[tableAddr].player}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    const { visible, expanded, contractData, gasStat } = this.state;
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

        <A
          href={`${conf().etherscanUrl}address/${this.props.contract.address}`}
          style={{ marginLeft: 15 }}
          target="_blank"
        >
          Etherscan
        </A>
        {expanded &&
          <div>
            <button onClick={this.handleRefresh}>
              refresh
            </button>
            <hr />

            {this.renderData(hands, contractData)}

            {this.renderGasStat(gasStat)}
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
