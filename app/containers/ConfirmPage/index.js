import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import { browserHistory } from 'react-router';

import account from '../../services/account';
// components
import FormGroup from '../../components/Form/FormGroup';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button';
import H1 from '../../components/H1';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validate = (values) => {
  const errors = {};
  if (!values.get('confCode')) {
    errors.confCode = 'Required';
  } else if (!uuidRegex.test(values.get('confCode'))) {
    errors.confCode = 'Invalid confirmation code';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

/* eslint-disable react/prop-types */
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <Input {...input} placeholder={label} type={type} />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class ConfirmPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return account.confirm(values.get('confCode')).catch((err) => {
      const errMsg = 'Email Confirmation failed!';
      if (err === 404) {
        throw new SubmissionError({ confCode: 'Unknown conf code.', _error: errMsg });
      } else if (err === 409) {
        throw new SubmissionError({ confCode: 'Conf code expired.', _error: errMsg });
      } else {
        throw new SubmissionError({ _error: `Email Confirmation failed with error code ${err}` });
      }
    }).then(() => {
      browserHistory.push('/login');
    });
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <Container>
        <H1>Please confirm your registration!</H1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="confCode" component={renderField} type="text" placeholder="code" />
          {error && <strong>{error}</strong>}
          <Button size="large" type="submit" disabled={submitting}>Submit</Button>
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
