/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { submitBet, submitFold, submitCheck, submitShow, stopPolling } from '../Table/actions';
import { privKeySelector } from '../AccountProvider/selectors';
import { makeCardSelector } from '../Seat/selectors';
import { makeAmountToCallSelector, makeMyMaxBetSelector, makeMaxBetSelector, makeHandSelector } from '../Table/selectors';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  stop() {
    stopPolling();
  }

  render() {
    const actionBar = (
      <div className="actions">
        <div className="row">
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.bet(this.props.hand.handId,
                                    parseInt(this.state.amount, 10),
                                    this.props.privKey,
                                    this.props.params.addr)}
          >Bet
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.checkCall()}
          >
            { (this.props.amountToCall === 0) ? 'Check' : `Call ${this.props.amountToCall}` }
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.fold(this.props.hand.handId,
                                      this.props.myMaxBet,
                                      this.props.privKey,
                                      this.props.params.addr)}
          >
            Fold
         </button>
        </div>
        <div className="row">
          <button
            className="btn btn-default btn-sm col-xs-4" value={'50000'}
            onClick={this.props.bet(this.props.hand.handId,
                                    5000,
                                    this.props.privKey,
                                    this.props.params.addr)}
          >POST SB
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4" value={'100000'}
            onClick={this.props.bet(this.props.hand.handId,
                                    10000,
                                    this.props.privKey,
                                    this.props.params.addr)}
          >POST BB
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={() => this.props.show(this.props.hand.handId,
                                           this.props.myMaxBet,
                                           this.props.cards,
                                           this.props.privKey,
                                           this.props.tableAddr)}
          >SHOW
          </button>
          <button
            className="btn btn-default btn-sm col-xs-12"
            onClick={() => this.stop()}
          >
            STOP POLLING
          </button>
          <input
            type="text" className="input-amount"
            onChange={(e) => this.props.updateAmount(e)}
          />
        </div>
      </div>
        );

    return actionBar;
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    bet: (handId, amount, privKey, tableAddr) => dispatch(submitBet(handId, amount, privKey, tableAddr)),
    fold: (handId, amount, privKey, tableAddr) => dispatch(submitFold(handId, amount, privKey, tableAddr)),
    show: (handId, myMaxBet, cards, privKey, tableAddr) => dispatch(submitShow(handId, myMaxBet, cards, privKey, tableAddr)),
    checkCall: () => {
      if (this.props.amountToCall === 0) {
        dispatch(submitCheck(this.props.hand.handId, this.props.myMaxBet, this.props.privKey, this.props.params.addr, this.props.hand.state));
      } else {
        dispatch(submitBet(this.props.hand.handId, this.props.maxBet, this.props.privKey, this.props.params.addr));
      }
    },
    updateAmount: (e) => {
      this.setState({ amount: e.target.value });
    },
  };
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => ({
    privKey: privKeySelector(state),
    hand: makeHandSelector(state),
    cards: makeCardSelector(state),
    myMaxBet: makeMyMaxBetSelector(state),
    maxBet: makeMaxBetSelector(state),
    amountToCall: makeAmountToCallSelector(state),
  });

  return mapStateToProps;
};

ActionBar.propTypes = {
  privKey: React.PropTypes.string,
  hand: React.PropTypes.object,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  maxBet: React.PropTypes.number, // eslint-disable-line
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  tableAddr: React.PropTypes.string,
  bet: React.PropTypes.func,
  fold: React.PropTypes.func,
  checkCall: React.PropTypes.func,
  show: React.PropTypes.func,
  updateAmount: React.PropTypes.func,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(ActionBar);
