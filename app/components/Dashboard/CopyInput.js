import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

import { CopyIcon } from './styles';

function copyText(input) {
  input.select();

  try {
    document.execCommand('copy');
  } finally {
    input.setSelectionRange(0, 0);
  }
}

/* eslint-disable jsx-a11y/label-has-for */
function CopyInput({ value }) {
  return (
    <label style={{ position: 'relative' }}>
      <CopyIcon className="fa fa-copy" />
      <Input
        defaultValue={value}
        onClick={(e) => copyText(e.currentTarget)}
        readOnly
        style={{ width: value.length * 9.5 }}
      />
    </label>
  );
}

CopyInput.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CopyInput;
