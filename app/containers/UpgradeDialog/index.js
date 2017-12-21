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
import NoInjectedMessage from '../../containers/Web3Alerts/NoInjected';
import SubmitButton from '../../components/SubmitButton';
import FormGroup from '../../components/Form/FormGroup';
import { CheckBox } from '../../components/Input';
import Label from '../../components/Label';
import H2 from '../../components/H2';
import A from '../../components/A';

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
          Unlock your account
        </H2>

        <p>
          After you unlock your account you will be able to:<br />
          – make deposits greater than 0.1 ETH<br />
          – control your wallet with your own private key<br />
          – <A href="http://help.acebusters.com/how-to-participate-in-the-crowdsale/invest-using-the-acebusters-dapp-recommended" target="_blank">powerUp</A> your NTZ to ABP after the crowdsale
        </p>
        <p>
          Here’s more info on{' '}
          <A
            href="http://help.acebusters.com/quick-guide-to-acebusters/winning-the-pots/how-to-upgrade-to-a-shark-account"
            target="_blank"
          >
            account unlocking
          </A>
        </p>

        {!window.web3 &&
          <NoWeb3Message />
        }
        {window.web3 && !account.injected &&
          <NoInjectedMessage />
        }
        {account.injected && !account.onSupportedNetwork &&
          <UnsupportedNetworkMessage />
        }

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          {account.injected && !submitting && !success &&
            <div>
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
