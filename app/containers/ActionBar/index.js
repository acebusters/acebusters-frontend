/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { submitBet, submitFold, submitCheck, submitShow, updateAmount } from '../Table/actions';
import { makeCardSelector } from '../Seat/selectors';
import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector } from '../Table/selectors';
import Button from '../../components/Button';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const actionBar = (
      <div className="actions">
        <div className="row">
          <Button
            className="btn btn-default btn-sm col-xs-4"
            onClick={() => this.props.bet(this.props.hand.handId,
                                          parseInt(this.props.amount, 10),
                                          this.props.location.query.privKey,
                                          this.props.params.id)}
          >
            Bet
          </Button>
          <Button
            className="btn btn-default btn-sm col-xs-4"
            onClick={() => this.props.checkCall(this.props.hand.handId,
                                                this.props.myMaxBet,
                                                this.props.maxBet,
                                                this.props.location.query.privKey,
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
                                           this.props.location.query.privKey,
                                           this.props.params.id)}
          >
            Fold
         </Button>
        </div>
        <div className="row">
          <Button
            className="btn btn-default btn-sm col-xs-4" value={'50000'}
            onClick={() => this.props.bet(this.props.hand.handId,
                                          50000,
                                          this.props.location.query.privKey,
                                          this.props.params.id)}
          >
            POST SB
          </Button>
          <Button
            className="btn btn-default btn-sm col-xs-4" value={'100000'}
            onClick={() => this.props.bet(this.props.hand.handId,
                                          100000,
                                          this.props.location.query.privKey,
                                          this.props.params.id)}
          >
            POST BB
          </Button>
          <Button
            className="btn btn-default btn-sm col-xs-4"
            onClick={() => this.props.show(this.props.hand.handId,
                                           this.props.myMaxBet,
                                           this.props.cards,
                                           this.props.location.query.privKey,
                                           this.props.params.id)}
          >
            SHOW
          </Button>
          <input
            type="text" className="input-amount"
            placeholder="Enter amount here"
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


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  cards: makeCardSelector(),
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
});

ActionBar.propTypes = {
  hand: React.PropTypes.object,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  privKey: React.PropTypes.func,
  amount: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  maxBet: React.PropTypes.number,
  bet: React.PropTypes.func,
  fold: React.PropTypes.func,
  checkCall: React.PropTypes.func,
  show: React.PropTypes.func,
  updateAmount: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
