import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';
import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';

import { makeSbSelector } from '../Table/selectors';
import { makeSelectProxyAddr, makeSelectHasWeb3, makeSelectNetworkSupported } from '../AccountProvider/selectors';
import { formatNtz } from '../../utils/amountFormatter';

export class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      amount: props.sb * 40,
      submitting: false,
    };
    this.updateAmount = this.updateAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateAmount(value) {
    const amount = value;
    this.setState({ amount });
  }

  handleSubmit() {
    this.props.handleJoin(this.props.pos, this.state.amount);
  }

  render() {
    const { sb, hasWeb3, balance, modalDismiss, networkSupported } = this.props;
    const { submitting } = this.state;

    const min = sb * 40;
    const tableMax = sb * 200;
    const max = (balance < tableMax) ? balance - (balance % sb) : tableMax;
    if (balance < min) {
      return (
        <div style={{ minWidth: '20em' }}>
          <H2>Sorry!</H2>
          <p>Your balance is not sufficient to join this table!</p>
          <SubmitButton onClick={modalDismiss}>OK</SubmitButton>
        </div>
      );
    }
    return (
      <div style={{ minWidth: '20em' }}>
        <Slider
          data-orientation="vertical"
          value={this.state.amount}
          tooltip={false}
          min={min}
          max={max}
          step={sb}
          onChange={this.updateAmount}
        />
        <div>Max: {formatNtz(max)} NTZ</div>
        <div>{ (this.state) ? formatNtz(this.state.amount) : formatNtz(min) } NTZ</div>

        {!hasWeb3 && <NoWeb3Message />}
        {!networkSupported && <UnsupportedNetworkMessage />}

        <SubmitButton
          onClick={this.handleSubmit}
          disabled={!hasWeb3 || !networkSupported}
          submitting={submitting}
        >
          Join
        </SubmitButton>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  proxyAddr: makeSelectProxyAddr(),
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
});

JoinDialog.propTypes = {
  handleJoin: PropTypes.func,
  modalDismiss: PropTypes.func,
  hasWeb3: PropTypes.bool,
  networkSupported: PropTypes.bool,
  pos: PropTypes.any,
  sb: PropTypes.number,
  balance: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinDialog);
