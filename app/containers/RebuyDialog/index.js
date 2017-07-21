import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-rangeslider';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';
import { makeSbSelector } from '../Table/selectors';
import { makeSelectHasWeb3, makeSelectNetworkSupported } from '../AccountProvider/selectors';
import { formatNtz } from '../../utils/amountFormatter';

import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';
import FormGroup from '../../components/Form/FormGroup';

import messages from './messages';


const ButtonContainer = styled.div`
  display: flex;

  & > * {
    flex: 1;
  }
`;

/* eslint-disable react/prop-types */
const renderSlider = ({ input, ...props }) => (
  <FormGroup>
    <Slider
      data-orientation="vertical"
      tooltip={false}
      {...input}
      {...props}
    />
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class RebuyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  handleSubmit(values) {
    return this.props.handleRebuy(values.get('amount'));
  }

  handleLeave() {
    this.props.handleLeave(this.props.pos);
  }

  render() {
    const {
      hasWeb3,
      sb,
      balance,
      modalDismiss,
      submitting,
      networkSupported,
      handleSubmit,
      amount,
    } = this.props;

    const min = sb * 40;
    const tableMax = sb * 200;
    const max = (balance < tableMax) ? balance - (balance % sb) : tableMax;

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
      <Form
        style={{ minWidth: '20em' }}
        onSubmit={handleSubmit(this.handleSubmit)}
      >
        <Field
          component={renderSlider}
          name="amount"
          min={min}
          max={max}
          step={sb}
        />

        <div>
          <FormattedMessage {...messages.max} />
          <span>{formatNtz(max)} NTZ</span>
        </div>
        <div>{formatNtz(amount)} NTZ</div>

        {!hasWeb3 && <NoWeb3Message />}
        {!networkSupported && <UnsupportedNetworkMessage />}

        <ButtonContainer>
          <SubmitButton onClick={this.handleLeave}>
            <FormattedMessage {...messages.leave} />
          </SubmitButton>

          <SubmitButton
            disabled={!hasWeb3 || !networkSupported}
            submitting={submitting}
          >
            <FormattedMessage {...messages.rebuy} />
          </SubmitButton>
        </ButtonContainer>
      </Form>
    );
  }
}

const valueSelector = formValueSelector('rebuy');
const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
  valueSelector: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
});

RebuyDialog.propTypes = {
  handleRebuy: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  networkSupported: PropTypes.bool,
  handleLeave: PropTypes.func,
  modalDismiss: PropTypes.func,
  balance: React.PropTypes.number,
  hasWeb3: React.PropTypes.bool,
  sb: PropTypes.number,
  amount: PropTypes.number,
  pos: PropTypes.number,
};

export default connect(mapStateToProps)(
  reduxForm({ form: 'rebuy' })(RebuyDialog)
);
