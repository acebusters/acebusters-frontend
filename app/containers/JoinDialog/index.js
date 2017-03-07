import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const validate = (values) => {
  const errors = {};
  if (!values.get('amount')) {
    errors.amount = 'Required';
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

class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const amount = parseInt(values.get('amount'), 10);
    const rv = this.props.handleJoin(this.props.pos, amount);
    console.log(rv);
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="amount" component={renderField} type="number" placeholder="amount" />
          {error && <strong>{error}</strong>}
          <div>
            <button type="submit" disabled={submitting}>Submit</button>
          </div>
        </Form>
      </div>
    );
  }
}

JoinDialog.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleJoin: PropTypes.func,
  pos: PropTypes.any,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'join', validate, warn })(JoinDialog));
