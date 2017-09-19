import React from 'react';
import { Receipt } from 'poker-helper';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field, SubmissionError, reduxForm } from 'redux-form/immutable';

import { makeSelectAccountData } from '../../containers/AccountProvider/selectors';
import { getWeb3 } from '../../containers/AccountProvider/utils';
import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';
import SubmitButton from '../../components/SubmitButton';
import FormGroup from '../../components/Form/FormGroup';
import { CheckBox } from '../../components/Input';
import Label from '../../components/Label';
import H2 from '../../components/H2';

import { accountUnlocked } from '../AccountProvider/actions';

import { ABI_PROXY } from '../../app.config';
import { waitForTx } from '../../utils/waitForTx';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';
import * as accountService from '../../services/account';

const validate = (values) => {
  const errors = {};

  if (!values.get('accept')) {
    errors.accept = 'Required';
  }

  return errors;
};

/* eslint-disable react/prop-types */
const renderCheckBox = ({ input, label, type }) => (
  <FormGroup>
    <Label>
      <CheckBox {...input} placeholder={label} type={type} />
      {label}
    </Label>
  </FormGroup>
);
/* eslint-enable react/prop-types */

class UpgradeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.submitting === false && this.props.submitting === true && !nextProps.invalid) {
      this.setState({ success: true });
      this.props.accountUnlocked();
    }
  }

  async handleSubmit() {
    const { account } = this.props;
    const proxyContract = getWeb3(true).eth.contract(ABI_PROXY).at(account.proxy);
    const unlockTx = promisifyWeb3Call(proxyContract.unlock);

    try {
      const unlockRequest = new Receipt().unlockRequest(account.injected).sign(`0x${account.privKey}`);
      const unlock = await accountService.unlock(unlockRequest);
      const txHash = await unlockTx(
        ...Receipt.parseToParams(unlock),
          { from: account.injected },
      );
      await waitForTx(getWeb3(), txHash);
    } catch (e) {
      setImmediate(() => this.props.change('accept', false));
      throw new SubmissionError({ _error: `Error: ${e.message || e}` });
    }
  }

  render() {
    const { success } = this.state;
    const {
      invalid,
      submitting,
      handleSubmit,
      onSuccessButtonClick,
      account,
    } = this.props;

    return (
      <div>
        <H2>Upgrade your account</H2>

        {!account.injected && <NoWeb3Message />}
        {account.injected && !account.onSupportedNetwork &&
          <UnsupportedNetworkMessage />}

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          {account.injected && !submitting && !success &&
            <div>
              <p>This will upgrade your account</p>
              <Field
                name="accept"
                type="checkbox"
                component={renderCheckBox}
                label="I understand that it will be my sole responsible to secure my account and balance"
              />
            </div>
          }

          {submitting &&
            <p>Account upgrade tx pending...</p>
          }

          {success && <p>Account upgraded successful</p>}

          {!success &&
            <SubmitButton
              disabled={!account.injected || invalid}
              submitting={submitting}
            >
              Upgrade
            </SubmitButton>
          }
          {success &&
            <SubmitButton type="button" onClick={onSuccessButtonClick}>
              Ok
            </SubmitButton>
          }
        </Form>
      </div>
    );
  }
}

UpgradeDialog.propTypes = {
  account: PropTypes.object,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  accountUnlocked: PropTypes.func,
  change: PropTypes.func,
  onSuccessButtonClick: PropTypes.func,
};

UpgradeDialog.defaultProps = {
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
});

export default connect(mapStateToProps, { accountUnlocked })(
  reduxForm({
    form: 'upgrade',
    validate,
  })(UpgradeDialog)
);
