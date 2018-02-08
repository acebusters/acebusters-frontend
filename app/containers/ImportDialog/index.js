import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Form, Field } from 'redux-form/immutable';
import { connect } from 'react-redux';

import SubmitButton from '../../components/SubmitButton';

import { walletImported } from '../../containers/AccountProvider/actions';

class ImportDialog extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func,
    walletImported: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.walletImported(values.get('mnemonic'));
  }

  render() {
    const { handleSubmit, submitting, invalid } = this.props;

    // ToDo: remove input styling. For some reason redux-form do not handle events on Input component 🤔
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} style={{ width: 500 }}>
        <Field
          name="mnemonic"
          component="input"
          placeholder="Mnemonic phrase"
          style={{
            padding: 10,
            margin: 0,
            width: '100%',
            color: 'black',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: 18,
            border: '1px solid gainsboro',
            borderRadius: 4,
            marginBottom: 20,
          }}
        />

        <SubmitButton
          submitting={submitting}
          disabled={invalid}
        >
          Import wallet
        </SubmitButton>
      </Form>
    );
  }
}

export default connect(undefined, { walletImported })(
  reduxForm({ form: 'import' })(ImportDialog)
);
