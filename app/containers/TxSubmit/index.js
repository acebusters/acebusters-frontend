import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectIsLocked, makeSelectProxyAddr, makeSelectCanSendTx } from '../AccountProvider/selectors';
import Alert from '../../components/Alert';
import SubmitButton from '../../components/SubmitButton';

import { ButtonContainer } from './styles';

class TxSubmit extends React.Component {
  static propTypes = {
    estimate: PropTypes.func.isRequired,
    estimateArgs: PropTypes.array,
    isLocked: PropTypes.bool,
    submitButtonLabel: PropTypes.any,
    cancelButtonLabel: PropTypes.any,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    canSendTx: PropTypes.bool,
    gasThreshold: PropTypes.number,
    possibleFailReason: PropTypes.any,
  };

  static defaultProps = {
    gasThreshold: 1000000,
  };

  constructor(props) {
    super(props);

    this.state = {
      gas: null,
    };
    this.runEstimate(props);
  }

  componentWillReceiveProps(props) {
    if (
      props.estimate !== this.props.estimate ||
      props.invalid !== this.props.invalid ||
      props.canSendTx !== this.props.canSendTx ||
      props.estimateArgs !== this.props.estimateArgs
    ) {
      this.runEstimate(props);
    }
  }

  get gasTooHigh() {
    return this.state.gas > this.props.gasThreshold;
  }

  runEstimate(props) {
    const { isLocked, invalid, canSendTx, estimate, estimateArgs } = props;
    if (!isLocked && !invalid && canSendTx && estimateArgs) {
      estimate(...estimateArgs).then((gas) => this.setState({ gas }));
    }
  }

  renderAlert() {
    const { isLocked, possibleFailReason } = this.props;
    const { gas } = this.state;

    if (isLocked || !gas) {
      return null;
    }

    if (this.gasTooHigh) {
      return (
        <Alert theme="warning" key="error">
          Transaction probably will fail.
          {possibleFailReason && <br />}
          {possibleFailReason}
        </Alert>
      );
    }

    return (
      <Alert theme="success" key="estimate">
        Be sure to give at least <FormattedNumber value={gas} /> gas limit for your transaction.
        Otherwise&nbsp;transaction can fail
      </Alert>
    );
  }

  render() {
    const {
      submitButtonLabel,
      cancelButtonLabel,
      onCancel,
      onSubmit,
      submitting,
      canSendTx,
      invalid,
      isLocked,
    } = this.props;
    const { gas } = this.state;


    return (
      <div>
        {!invalid && canSendTx && this.renderAlert()}

        <ButtonContainer>
          <SubmitButton
            disabled={!canSendTx || (!isLocked && !gas) || invalid || this.gasTooHigh}
            submitting={submitting}
            onClick={onSubmit}
            type={onSubmit ? 'button' : 'submit'}
          >
            {submitButtonLabel}
          </SubmitButton>
          {onCancel &&
            <SubmitButton type="button" onClick={onCancel}>
              {cancelButtonLabel}
            </SubmitButton>
          }
        </ButtonContainer>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isLocked: makeSelectIsLocked(),
  proxyAddr: makeSelectProxyAddr(),
  canSendTx: makeSelectCanSendTx(),
});

export default connect(mapStateToProps)(TxSubmit);
