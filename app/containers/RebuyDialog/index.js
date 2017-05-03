
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import Button from '../../components/Button';
import H2 from '../../components/H2';
import { makeSbSelector } from '../Table/selectors';

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
    this.props.handleRebuy(this.state.amount);
  }

  handleLeave() {
    this.props.handleLeave();
  }

  render() {
    const min = this.props.sb * 40;
    const max = Math.min(this.props.balance, this.props.sb * 200);
    const { amount } = this.state;

    if (this.props.balance < min) {
      return (
        <div style={{ minWidth: '20em' }}>
          <H2>
            <FormattedMessage {...messages.sorry} />
          </H2>
          <p>
            <FormattedMessage {...messages.balanceOut} />
          </p>
          <Button onClick={this.props.modalDismiss}>
            <FormattedMessage {...messages.ok} />
          </Button>
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
        >
        </Slider>
        <div>
          <FormattedMessage {...messages.max} />
          <span>{max}</span>
        </div>
        <div>{amount}</div>
        <ButtonContainer>
          <ButtonBox>
            <Button onClick={this.handleLeave}>
              <FormattedMessage {...messages.leave} />
            </Button>
          </ButtonBox>
          <ButtonBox>
            <Button onClick={this.handleSubmit}>
              <FormattedMessage {...messages.rebuy} />
            </Button>
          </ButtonBox>
        </ButtonContainer>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
});

RebuyDialog.propTypes = {
  handleRebuy: PropTypes.func,
  handleLeave: PropTypes.func,
  modalDismiss: PropTypes.func,
  balance: React.PropTypes.number,
  sb: PropTypes.number,
};

export default connect(mapStateToProps)(RebuyDialog);
