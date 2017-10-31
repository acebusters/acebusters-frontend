import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFishWarned } from 'containers/Dashboard/actions';
import { modalDismiss } from 'containers/App/actions';

import SubmitButton from 'components/SubmitButton';
import {
  DialogContents,
  DialogTitle,
  DialogButtonWrapper,
} from 'components/Modal/styles';

const FishWarningDialog = (props) => {
  const handleAcceptClick = () => {
    props.setFishWarned();
    props.modalDismiss();
    props.showDepositDialog();
  };
  return (
    <DialogContents>
      <DialogTitle>Warning!</DialogTitle>
      Account limit 0.1 ETH. Higher deposits will be rejected.
      <DialogButtonWrapper>
        <SubmitButton type="button" onClick={handleAcceptClick}>
          Accept
        </SubmitButton>
      </DialogButtonWrapper>
    </DialogContents>
  );
};
FishWarningDialog.propTypes = {
  setFishWarned: PropTypes.func.isRequired,
  modalDismiss: PropTypes.func.isRequired,
  showDepositDialog: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  setFishWarned,
  modalDismiss,
})(FishWarningDialog);
