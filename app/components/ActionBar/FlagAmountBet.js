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

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleRef = this.handleRef.bind(this);

    this.state = {
      amount: props.amount,
      touched: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sliderOpen !== this.props.sliderOpen && nextProps.sliderOpen && this.input) {
      setTimeout(() => {
        this.input.focus();
      }, 1000);
    }

    if (nextProps.amount !== this.props.amount) {
      this.setState({
        amount: nextProps.amount,
        touched: false,
      });
    }
  }

  handleKeyDown(e) {
    const { sb } = this.props;
    const { amount } = this.state;

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
      this.handleUpdate(NTZ_DECIMALS.mul(Number(this.state.amount)));
      if (!active || disabled || mode === BET) return;
      setActionBarButtonActive(BET);
      handleClickButton(BET);
    }
  }

  handleBlur() {
    if (this.state.touched) {
      this.handleUpdate(NTZ_DECIMALS.mul(Number(this.state.amount)));
    }
  }

  handleChange(e) {
    this.setState({
      amount: e.target.value,
      touched: true,
    });
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
    const { sliderOpen, sb } = this.props;
    const { amount, touched } = this.state;

    return (
      <FlagBet sliderOpen={sliderOpen}>
        <button onClick={() => this.handleUpdate(amount - (sb * 2))}>
          -
        </button>
        <input
          ref={this.handleRef}
          type="number"
          value={touched ? amount : formatNtz(amount)}
          onBlur={this.handleBlur}
          onKeyUp={this.handleKeyUp}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
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
