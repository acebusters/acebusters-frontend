import React from 'react';
import PropTypes from 'prop-types';

import SubmitButton from 'components/SubmitButton';
import {
  DialogContents,
  DialogTitle,
  DialogButtonWrapper,
} from 'components/Modal/styles';

const ConfirmDialog = ({ title, msg, buttonText, onSubmit, handleClose }) => (
  <DialogContents>
    {title && <DialogTitle>{title}</DialogTitle>}
    <p>{msg}</p>
    <DialogButtonWrapper>
      <SubmitButton onClick={onSubmit || handleClose}>
        {buttonText || 'OK'}
      </SubmitButton>
    </DialogButtonWrapper>
  </DialogContents>
);
ConfirmDialog.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  msg: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttonText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onSubmit: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
};

export default ConfirmDialog;
