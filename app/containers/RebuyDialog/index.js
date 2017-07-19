import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';
import { makeSbSelector } from '../Table/selectors';
import { makeSelectHasWeb3, makeSelectNetworkSupported } from '../AccountProvider/selectors';

import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';

import messages from './messages';


const ButtonContainer = styled.div`
  display: flex;
`;

const ButtonBox = styled.div`
  flex: 1;
`;


export class RebuyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.sb * 40,
    };
    this.updateAmount = this.updateAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  updateAmount(value) {
    const amount = value;
    this.setState({ amount });
  }

  handleSubmit() {
    return this.props.handleRebuy(this.state.amount);
  }

  handleLeave() {
    this.props.handleLeave();
  }

  render() {
    const { hasWeb3, sb, balance, modalDismiss, submitting, networkSupported } = this.props;
    const min = sb * 40;
    const max = Math.min(balance, sb * 200);
    const { amount } = this.state;

    if (balance < min) {
      return (
        <div style={{ minWidth: '20em' }}>
          <H2>
            <FormattedMessage {...messages.sorry} />
          </H2>
          <p>
            <FormattedMessage {...messages.balanceOut} />
          </p>
          <SubmitButton onClick={modalDismiss}>
            <FormattedMessage {...messages.ok} />
          </SubmitButton>
        </div>
      );
    }

    return (
      <div style={{ minWidth: '20em' }}>
        <Slider
          data-orientation="vertical"
          value={amount}
          tooltip={false}
          min={min}
          max={max}
          step={1}
          onChange={this.updateAmount}
        />
        <div>
          <FormattedMessage {...messages.max} />
          <span>{max}</span>
        </div>
        <div>{amount}</div>

        {!hasWeb3 && <NoWeb3Message />}
        {!networkSupported && <UnsupportedNetworkMessage />}

        <ButtonContainer>
          <ButtonBox>
            <SubmitButton onClick={this.handleLeave}>
              <FormattedMessage {...messages.leave} />
            </SubmitButton>
          </ButtonBox>
          <ButtonBox>
            <SubmitButton
              onClick={this.handleSubmit}
              disabled={!hasWeb3 || !networkSupported}
              submitting={submitting}
            >
              <FormattedMessage {...messages.rebuy} />
            </SubmitButton>
          </ButtonBox>
        </ButtonContainer>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
});

RebuyDialog.propTypes = {
  handleRebuy: PropTypes.func,
  submitting: PropTypes.bool,
  networkSupported: PropTypes.bool,
  handleLeave: PropTypes.func,
  modalDismiss: PropTypes.func,
  balance: React.PropTypes.number,
  hasWeb3: React.PropTypes.bool,
  sb: PropTypes.number,
};

export default connect(mapStateToProps)(RebuyDialog);
