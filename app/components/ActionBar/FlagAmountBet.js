import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import { FlagBet } from './styles';
import { formatNtz, NTZ_DECIMALS } from '../../utils/amountFormatter';

import {
  BET,
} from '../../containers/ActionBar/actions';

/* eslint-disable jsx-a11y/no-autofocus */
class FlagAmountBet extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sliderOpen !== this.props.sliderOpen && nextProps.sliderOpen && this.input) {
      setTimeout(() => {
        this.input.focus();
      }, 1000);
    }
  }

  handleKeyDown(e) {
    const { sb, amount } = this.props;

    switch (e.keyCode) { // eslint-disable-line default-case
      case 38: // ↑
        e.preventDefault();
        this.handleUpdate(amount + (sb * 2));
        break;

      case 40: // ↓
        e.preventDefault();
        this.handleUpdate(amount - (sb * 2));
        break;
    }
  }

  handleKeyUp(e) {
    const { handleClickButton, setActionBarButtonActive, mode, active, disabled } = this.props;

    if (e.keyCode === 13) { // Enter
      if (!active || disabled || mode === BET) return;
      setActionBarButtonActive(BET);
      handleClickButton(BET);
    }
  }

  handleChange(e) {
    this.handleUpdate(NTZ_DECIMALS.mul(Number(e.target.value)));
  }

  handleUpdate(amount) {
    const { updateAmount, minRaise, myStack } = this.props;

    updateAmount(
      BigNumber.min(
        BigNumber.max(amount, minRaise),
        myStack
      )
    );
  }

  handleRef(input) {
    this.input = input;
  }

  render() {
    const { amount, sliderOpen, sb } = this.props;

    return (
      <FlagBet sliderOpen={sliderOpen}>
        <button onClick={() => this.handleUpdate(amount - (sb * 2))}>
          -
        </button>
        <input
          ref={this.handleRef}
          type="number"
          value={formatNtz(amount)}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={() => this.handleUpdate(amount + (sb * 2))}>
          +
        </button>
      </FlagBet>
    );
  }
}
FlagAmountBet.propTypes = {
  amount: PropTypes.number,
  myStack: PropTypes.number,
  minRaise: PropTypes.number,
  sb: PropTypes.number,
  updateAmount: PropTypes.func,
  sliderOpen: PropTypes.bool,
  handleClickButton: PropTypes.func,
  setActionBarButtonActive: PropTypes.func,
  mode: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default FlagAmountBet;
