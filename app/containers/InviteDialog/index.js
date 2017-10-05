import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import { ErrorMessage } from '../../components/FormMessages';

import messages from './messages';

const validate = (values) => {
  const errors = {};
  if (!values.get('email')) {
    errors.amount = 'Required';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

class InviteDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    values.get('email');
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="email" component={FormField} type="text" placeholder="e-mail" />
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton disabled={submitting}>Submit</SubmitButton>
        </Form>
      </div>
    );
  }
}

InviteDialog.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'join', validate, warn })(InviteDialog));
