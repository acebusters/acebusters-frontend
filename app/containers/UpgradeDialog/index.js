import React from 'react';
import { Receipt } from 'poker-helper';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field, SubmissionError, reduxForm } from 'redux-form/immutable';

import { makeSelectAccountData } from '../../containers/AccountProvider/selectors';
import { getWeb3 } from '../../containers/AccountProvider/utils';
import NoWeb3Message from '../../containers/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../containers/Web3Alerts/UnsupportedNetwork';
import SubmitButton from '../../components/SubmitButton';
import FormGroup from '../../components/Form/FormGroup';
import { CheckBox } from '../../components/Input';
import Label from '../../components/Label';
import H2 from '../../components/H2';
import A from '../../components/A';
import { Icon } from '../../containers/Dashboard/styles';

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
        <H2>
          Unlock your account &nbsp;
          <A
            href="http://help.acebusters.com/quick-guide-to-acebusters/winning-the-pots/how-to-upgrade-to-a-shark-account"
            target="_blank"
          >
            <Icon
              className="fa fa-info-circle"
              aria-hidden="true"
            />
          </A>
        </H2>

        {!account.injected &&
          <NoWeb3Message />
        }
        {account.injected && !account.onSupportedNetwork &&
          <UnsupportedNetworkMessage />
        }

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          {account.injected && !submitting && !success &&
            <div>
              <p>This will unlock your account</p>
              <Field
                name="accept"
                type="checkbox"
                component={renderCheckBox}
                label="I understand that it will be my sole responsible to secure my account and balance"
              />
            </div>
          }

          {submitting &&
            <p>Account unlock tx pending...</p>
          }

          {success && <p>Account unlocked successful</p>}

          {!success &&
            <SubmitButton
              disabled={!account.injected || !account.onSupportedNetwork || invalid}
              submitting={submitting}
            >
              Unlock
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
