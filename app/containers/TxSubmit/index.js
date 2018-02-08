import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectIsLocked, makeSelectProxyAddr, makeSelectCanSendTx } from '../AccountProvider/selectors';
import Alert from '../../components/Alert';
import SubmitButton from '../../components/SubmitButton';
import { makeCancelable } from '../../utils/makeCancelable';

import { ButtonContainer } from './styles';

const canRunEstimate = ({ isLocked, invalid, submitting, canSendTx, estimateArgs }) => (
  !isLocked &&
  !invalid &&
  !submitting &&
  canSendTx &&
  estimateArgs
);

class TxSubmit extends React.Component {
  static propTypes = {
    estimate: PropTypes.func.isRequired,
    estimateArgs: PropTypes.any,
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
  }

  componentWillMount() {
    this.refreshGas(this.props);

    /*
    * Sometimes, estimate can be extremely high
    * even if transaction will be successful.
    * Rerun estimate will help in such situation
    */
    this.interval = setInterval(() => {
      if (!this.state.gas || this.gasTooHigh) {
        this.refreshGas(this.props);
      }
    }, 1000);
  }

  componentWillReceiveProps(props) {
    if (
      props.estimate !== this.props.estimate ||
      props.invalid !== this.props.invalid ||
      props.canSendTx !== this.props.canSendTx ||
      props.submitting !== this.props.submitting ||
      props.estimateArgs !== this.props.estimateArgs
    ) {
      this.refreshGas(props);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    if (this.gasPromise) {
      this.gasPromise.cancel();
    }
  }

  get gasTooHigh() {
    return this.state.gas > this.props.gasThreshold;
  }

  refreshGas(props) {
    this.gasPromise = makeCancelable(this.estimateGas(props));
    this.gasPromise.then(
      (gas) => {
        if (gas) {
          this.setState({ gas });
        }
      },
      () => null,
    );
  }

  estimateGas(props) {
    const { estimate, estimateArgs } = props;
    if (canRunEstimate(props)) {
      const args = Array.isArray(estimateArgs) ? estimateArgs : [estimateArgs];
      return estimate(...args);
    }

    return Promise.resolve(null);
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

    return null;
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
    } = this.props;
    const { gas } = this.state;
    const estimating = canRunEstimate(this.props) && !gas;

    return (
      <div>
        {!invalid && canSendTx && !submitting && this.renderAlert()}

        <ButtonContainer>
          <SubmitButton
            disabled={!canSendTx || !gas || invalid || this.gasTooHigh}
            submitting={submitting || estimating}
            onClick={onSubmit}
            type={onSubmit ? 'button' : 'submit'}
          >
            {estimating ? 'Estimating gas' : submitButtonLabel}
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
