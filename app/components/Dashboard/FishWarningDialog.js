import React from 'react';
import PropTypes from 'prop-types';

import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';

const FishWarningDialog = ({ onSuccessButtonClick }) => (
  <div>
    <H2>Warning!</H2>
    <span>Account limit 0.1 ETH. Higher deposits will be rejected.</span>
    <br /><br />
    <SubmitButton type="button" onClick={onSuccessButtonClick}>
      Accept
    </SubmitButton>
  </div>
);

FishWarningDialog.propTypes = {
  onSuccessButtonClick: PropTypes.func,
};

export default FishWarningDialog;
