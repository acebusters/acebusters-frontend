/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { submitBet, submitFold, submitCheck, submitShow, updateAmount } from '../Table/actions';
import { makeCardSelector } from '../Seat/selectors';
import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector } from '../Table/selectors';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const actionBar = (
      <div className="actions">
        <div className="row">
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.bet(this.props.hand.get('handId'),
                                    parseInt(this.props.amount, 10),
                                    this.props.privKey,
                                    this.props.params.addr)}
          >Bet
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.checkCall(this.props.hand.get('handId'),
                                          this.props.myMaxBet,
                                          this.props.maxBet,
                                          this.props.privKey,
                                          this.props.params.addr,
                                          this.props.hand.get('state'),
                                          this.props.amountToCall)}
          >
            { (this.props.amountToCall === 0) ? 'Check' : `Call ${this.props.amountToCall}` }
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={this.props.fold(this.props.hand.get('handId'),
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
            onClick={this.props.bet(this.props.hand.get('handId'),
                                    5000,
              this.props.privKey,
                                    this.props.params.addr)}
          >POST SB
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4" value={'100000'}
            onClick={this.props.bet(this.props.hand.get('handId'),
                                    10000,
                                    this.props.privKey,
                                    this.props.params.addr)}
          >POST BB
          </button>
          <button
            className="btn btn-default btn-sm col-xs-4"
            onClick={() => this.props.show(this.props.hand.get('handId'),
                                           this.props.myMaxBet,
                                           this.props.cards,
                                           this.props.privKey,
                                           this.props.tableAddr)}
          >SHOW
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
    checkCall: (handId, myMaxBet, maxBet, privKey, tableAddr, state, amountToCall) => {
      if (amountToCall === 0) {
        dispatch(submitCheck(handId, myMaxBet, privKey, tableAddr, state));
      } else {
        dispatch(submitBet(handId, myMaxBet, privKey, tableAddr));
      }
    },
    updateAmount: (e) => dispatch(updateAmount(e.target.value)),
  };
}

const mapStateToProps = (state) => ({
  privKey: makeSelectPrivKey(state),
  cards: makeCardSelector(state),
  amount: state.get('amount'),
  potSize: makePotSizeSelector(state),
  myMaxBet: makeMyMaxBetSelector(state),
});

ActionBar.propTypes = {
  hand: React.PropTypes.object,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  privKey: React.PropTypes.func,
  amount: React.PropTypes.number,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  maxBet: React.PropTypes.number,
  tableAddr: React.PropTypes.string,
  bet: React.PropTypes.func,
  fold: React.PropTypes.func,
  checkCall: React.PropTypes.func,
  show: React.PropTypes.func,
  updateAmount: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
