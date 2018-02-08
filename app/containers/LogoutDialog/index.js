import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from '../../components/Input';
import CopyInput from '../../components/CopyInput';
import SubmitButton from '../../components/SubmitButton';

import { modalDismiss } from '../../containers/App/actions';

function LogoutDialog(props) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <CopyInput
          name="amount"
          component={Input}
          value={props.wallet.mnemonic}
          autoFocus
        />
      </div>

      <SubmitButton onClick={props.modalDismiss} >
        OK
      </SubmitButton>
    </div>
  );
}

LogoutDialog.propTypes = {
  modalDismiss: PropTypes.func,
  wallet: PropTypes.object,
};

export default connect(undefined, { modalDismiss })(LogoutDialog);
