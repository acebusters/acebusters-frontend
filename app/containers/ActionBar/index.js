/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { submitBet, submitFold, submitCheck, submitShow, updateAmount } from '../Table/actions';
import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector } from '../Table/selectors';
import { makeStackSelector } from '../Seat/selectors';
import Button from '../../components/Button';
import ActionBarComponent from '../../components/ActionBar';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ActionBarComponent>
        <Button
          className="btn btn-default btn-sm col-xs-4"
          onClick={() => this.props.bet(this.props.hand.handId,
                                          parseInt(this.props.amount, 10),
                                          this.props.privKey,
                                          this.props.params.id)}
        >
          Bet
        </Button>
        <Button
          className="btn btn-default btn-sm col-xs-4"
          onClick={() => this.props.checkCall(this.props.hand.handId,
                                              this.props.myMaxBet,
                                              this.props.maxBet,
                                              this.props.privKey,
                                              this.props.params.id,
                                              this.props.hand.state,
                                              this.props.amountToCall)}
        >
          { (this.props.amountToCall === 0) ? 'Check' : `Call ${this.props.amountToCall}` }
        </Button>
        <Button
          className="btn btn-default btn-sm col-xs-4"
          onClick={() => this.props.fold(this.props.hand.handId,
                                         this.props.myMaxBet,
                                         this.props.privKey,
                                         this.props.params.id)}
        >
          Fold
        </Button>
        <Button
          className="btn btn-default btn-sm col-xs-4" value={'50000'}
          onClick={() => this.props.bet(this.props.hand.handId,
                                        50000,
                                        this.props.privKey,
                                        this.props.params.id)}
        >
          POST SB
        </Button>
        <Button
          className="btn btn-default btn-sm col-xs-4" value={'100000'}
          onClick={() => this.props.bet(this.props.hand.handId,
                                         100000,
                                         this.props.privKey,
                                         this.props.params.id)}
        >
          POST BB
        </Button>
        <Button
          className="btn btn-default btn-sm col-xs-4"
          onClick={() => this.props.show(this.props.hand.handId,
                                          this.props.myMaxBet,
                                          this.props.me.cards,
                                          this.props.privKey,
                                          this.props.params.id)}
        >
          SHOW
        </Button>
        <input
          type="range"
          min="50000" // small blind amount
          step="50000" // small blind amount
          max={this.props.stackSize}
          onChange={(e) => this.props.updateAmount(e)}
        />
        <div>{this.props.amount}</div>
      </ActionBarComponent>
    );
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


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  stackSize: makeStackSelector(),
});

ActionBar.propTypes = {
  hand: React.PropTypes.object,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  amount: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  maxBet: React.PropTypes.number,
  bet: React.PropTypes.func,
  me: React.PropTypes.object,
  fold: React.PropTypes.func,
  checkCall: React.PropTypes.func,
  show: React.PropTypes.func,
  updateAmount: React.PropTypes.func,
  stackSize: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
