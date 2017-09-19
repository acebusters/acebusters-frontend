import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Receipt, Type } from 'poker-helper';

import * as accountService from '../../services/account';
import * as storageService from '../../services/localStorage';

// components
import FormField from '../../components/Form/FormField';
import Container from '../../components/Container';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import FieldIntl from '../../components/FieldIntl';

import messages from './messages';

const validate = (values) => {
  const errors = {};
  if (!values.get('confCode')) {
    errors.confCode = 'Required';
  } else {
    try {
      const receipt = Receipt.parse(values.get('confCode'));
      if (receipt.type !== Type.CREATE_CONF && receipt.type !== Type.RESET_CONF) {
        errors.confCode = `Invalid receipt type: ${receipt.type}`;
      }
    } catch (err) {
      errors.confCode = `Invalid confirmation code: ${err.message}`;
    }
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

function messagesByReceiptType(type) {
  switch (type) {
    case Type.CREATE_CONF:
      return {
        header: messages.registerHeader,
        label: messages.registerLabel,
        placeholder: messages.registerPlaceholder,
        button: messages.registerButton,
      };

    case Type.RESET_CONF:
      return {
        header: messages.resetHeader,
        label: messages.resetLabel,
        placeholder: messages.resetPlaceholder,
        button: messages.resetButton,
      };

    default:
      return {
        header: messages.header,
        label: messages.label,
        placeholder: messages.placeholder,
        button: messages.button,
      };
  }
}

export class ConfirmPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);

    this.state = {
      type: null,
      msg: {
        header: messages.header,
        label: messages.label,
        placeholder: messages.placeholder,
        button: messages.button,
      },
    };
  }

  componentDidMount() {
    if (this.props.params.confCode) {
      this.handleCodeUpdate(this.props.params.confCode);
    }
  }

  onChangeCode(e) {
    const code = e.target.value;
    this.handleCodeUpdate(code);
  }

  handleCodeUpdate(code) {
    try {
      const receipt = Receipt.parse(code);
      this.setState({
        type: receipt.type,
        msg: messagesByReceiptType(receipt.type),
      });
    } catch (e) {
      // Note: means that it is an invalid code
    }
  }

  handleSubmit(values) {
    const confCode = decodeURIComponent(values.get('confCode'));
    const receipt = Receipt.parse(confCode);
    if (receipt.type === Type.CREATE_CONF) {
      return accountService.confirm(confCode).catch((err) => {
        const errMsg = 'Email Confirmation failed!';
        if (err.status && err.status === 409) {
          throw new SubmissionError({ confCode: 'Email already confirmed.', _error: errMsg });
        } else {
          throw new SubmissionError({ _error: `Email Confirmation failed with error code ${err}` });
        }
      }).then(() => {
        storageService.setItem('ab-confCode', values.get('confCode'));
        browserHistory.push('/generate');
      });
    }
    if (receipt.type === Type.RESET_CONF) {
      storageService.setItem('ab-confCode', values.get('confCode'));
      browserHistory.push('/generate');
      return Promise.resolve({});
    }
    throw new SubmissionError({ _error: 'Unknown receipt type' });
  }

  render() {
    const { error, handleSubmit, invalid, submitting } = this.props;
    const { msg } = this.state;

    return (
      <Container>
        <H1>
          <FormattedMessage {...msg.header} />
        </H1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <FieldIntl
            name="confCode"
            type="text"
            component={FormField}
            label={msg.label}
            placeholder={msg.placeholder}
            onChange={this.onChangeCode}
          />

          {error && <strong>{error}</strong>}

          <Button
            type="submit"
            size="large"
            disabled={submitting || invalid}
          >
            {(!submitting)
              ? <FormattedMessage {...msg.button} />
              : 'Please wait ...'
            }
          </Button>
        </Form>
      </Container>
    );
  }
}

ConfirmPage.propTypes = {
  ...propTypes,
  dispatch: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  hasWeb3: PropTypes.bool,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    confCode: ownProps.params.confCode && decodeURIComponent(ownProps.params.confCode),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'confirm', validate, warn })(ConfirmPage));
