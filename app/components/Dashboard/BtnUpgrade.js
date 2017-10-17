import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { UPGRADE_DIALOG } from 'containers/Modal/constants';

import Button from '../Button';

const BtnUpgrade = ({
  account,
  messages,
  modalAdd,
  modalDismiss,
}) => (
  <Button
    size="link"
    onClick={() => modalAdd({
      modalType: UPGRADE_DIALOG,
      modalProps: {
        proxyContract: account.proxy,
        onSuccessButtonClick: modalDismiss,
      },
      backdrop: true,
    })}
  >
    <FormattedMessage {...messages.upgradeAccount} />
  </Button>
);
BtnUpgrade.propTypes = {
  account: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  modalAdd: PropTypes.func.isRequired,
  modalDismiss: PropTypes.func.isRequired,
};

export default BtnUpgrade;
