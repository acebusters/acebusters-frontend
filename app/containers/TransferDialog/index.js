import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

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
  <div>
    <label htmlFor={input.name}>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
/* eslint-enable react/prop-types */

class TransferDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return values;
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="confCode" component={renderField} type="text" placeholder="code" />
          {error && <strong>{error}</strong>}
          <div>
            <button type="submit" disabled={submitting}>Submit</button>
          </div>
        </Form>
      </div>
    );
  }
}

TransferDialog.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'transfer', validate, warn })(TransferDialog));
