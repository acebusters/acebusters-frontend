import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  DialogContents,
  DialogTitle,
  DialogButtonWrapper,
  DialogText,
} from 'components/Modal/styles';
import Input from '../../components/Input';
import CopyInput from '../../components/CopyInput';
import SubmitButton from '../../components/SubmitButton';

import { modalDismiss } from '../../containers/App/actions';
import { makeSelectWallet } from '../../containers/AccountProvider/selectors';

function ExportDialog(props) {
  return (
    <DialogContents style={{ width: 680 }}>
      <DialogTitle>Export Wallet</DialogTitle>
      <DialogText>
        These 12-words can be used to recreate your wallet (testnet only).
      </DialogText>
      <CopyInput
        name="amount"
        component={Input}
        value={props.wallet.mnemonic}
        autoFocus
      />
      <DialogButtonWrapper>
        <SubmitButton onClick={props.modalDismiss}>
          OK
        </SubmitButton>
      </DialogButtonWrapper>
    </DialogContents>
  );
}

ExportDialog.propTypes = {
  modalDismiss: PropTypes.func,
  wallet: PropTypes.object,
};

export default connect((state, props) => ({
  wallet: makeSelectWallet()(state, props),
}), { modalDismiss })(ExportDialog);
