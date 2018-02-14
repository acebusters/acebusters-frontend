import React from 'react';
import PropTypes from 'prop-types';
import InviteDialog from '../../containers/InviteDialog';
import JoinDialog from '../../containers/JoinDialog';
import ImportDialog from '../../containers/ImportDialog';
import ExportDialog from '../../containers/ExportDialog';
import LogoutDialog from '../../containers/LogoutDialog';
import * as modals from '../../containers/Modal/constants';
import ConfirmDialog from './ConfirmDialog';
import SelectToken from './SelectToken';
import ModalsTransitionGroup from './ModalsTransitionGroup';
import { DialogTransitionGroup } from './DialogTransitionGroup';
import { ContainerTransitionGroup } from './ContainerTransitionGroup';
import XButton from './XButton';

import {
  DialogWrapper,
  CloseButton,
  Wrapper,
  Background,
  Modals,
} from './styles';

const MODALS = {
  [modals.CONFIRM_DIALOG]: ConfirmDialog,
  [modals.INVITE_DIALOG]: InviteDialog,
  [modals.JOIN_DIALOG]: JoinDialog,
  [modals.SELECT_TOKEN]: SelectToken,
  [modals.IMPORT_DIALOG]: ImportDialog,
  [modals.EXPORT_DIALOG]: ExportDialog,
  [modals.LOGOUT_DIALOG]: LogoutDialog,
};

const Modal = ({ modal, handleClose }) => {
  let SpecifiedModal; // required for leaveAnim
  if (modal) {
    SpecifiedModal = MODALS[modal.modalType];
  }
  return (
    <ModalsTransitionGroup>
      {modal && // required for leaveAnim
        <ContainerTransitionGroup component={Wrapper} style={{ zIndex: 2040 }}>
          <DialogTransitionGroup component={Modals}>
            <Background onClick={modal.modalProps.backdrop ? handleClose : null} />
            <DialogWrapper>
              <SpecifiedModal {...{ handleClose, ...modal.modalProps }} />
              <CloseButton onClick={handleClose}>
                <XButton />
              </CloseButton>
            </DialogWrapper>
          </DialogTransitionGroup>
        </ContainerTransitionGroup>
      }
    </ModalsTransitionGroup>
  );
};
Modal.propTypes = {
  modal: PropTypes.shape({
    modalType: PropTypes.string,
    modalProps: PropTypes.object,
    backdrop: PropTypes.bool,
  }),
  handleClose: PropTypes.func,
};

export default Modal;
