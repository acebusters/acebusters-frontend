import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Receipt, Type } from 'poker-helper';

import account from '../../services/account';
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
    let receipt;
    const confCode = decodeURIComponent(values.get('confCode'));
    try {
      receipt = Receipt.parse(confCode);
    } catch (err) {
      errors.confCode = `Invalid confirmation code: ${err.message}`;
    }
    if (receipt && receipt.type !== Type.CREATE_CONF &&
      receipt.type !== Type.RESET_CONF) {
      errors.confCode = `Invalid receipt type: ${receipt.type}`;
    }
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

export class ConfirmPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);

    this.state = {
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
      this.updateMesseageByCode(this.props.params.confCode);
    }
  }

  onChangeCode(e) {
    const code = e.target.value;
    this.updateMesseageByCode(code);
  }

  updateMesseageByCode(code) {
    let receipt;
    let msg;

    try {
      receipt = Receipt.parse(code);
    } catch (e) {
      // Note: means that it is an invalid code
      receipt = {};
    }

    switch (receipt.type) {
      case Type.CREATE_CONF: {
        msg = {
          header: messages.registerHeader,
          label: messages.registerLabel,
          placeholder: messages.registerPlaceholder,
          button: messages.registerButton,
        };

        break;
      }
      case Type.RESET_CONF: {
        msg = {
          header: messages.resetHeader,
          label: messages.resetLabel,
          placeholder: messages.resetPlaceholder,
          button: messages.resetButton,
        };

        break;
      }
      default: {
        msg = {
          header: messages.header,
          label: messages.label,
          placeholder: messages.placeholder,
          button: messages.button,
        };

        break;
      }
    }

    this.setState({ msg });
  }

  handleSubmit(values) {
    const confCode = decodeURIComponent(values.get('confCode'));
    const receipt = Receipt.parse(confCode);
    if (receipt.type === Type.CREATE_CONF) {
      return account.confirm(confCode).catch((err) => {
        const errMsg = 'Email Confirmation failed!';
        if (err === 409) {
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
          <Button type="submit" size="large" disabled={submitting || invalid}>
            { (!submitting) ? (<FormattedMessage {...msg.button} />) : 'Please wait ...' }

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
  handleSubmit: PropTypes.func,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    confCode: ownProps.params.confCode,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'confirm', validate, warn })(ConfirmPage));
