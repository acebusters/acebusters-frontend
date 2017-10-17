import React from 'react';
import PropTypes from 'prop-types';

import H2 from 'components/H2';
import SubmitButton from 'components/SubmitButton';

const ConfirmDialog = ({ title, msg, buttonText, onSubmit }) => (
  <div>
    {title && <H2>{title}</H2>}
    <p>{msg}</p>
    <SubmitButton onClick={onSubmit}>
      {buttonText}
    </SubmitButton>
  </div>
);
ConfirmDialog.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  msg: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ConfirmDialog;
