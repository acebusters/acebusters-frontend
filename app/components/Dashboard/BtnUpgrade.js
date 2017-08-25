import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import UpgradeDialog from '../../containers/UpgradeDialog';

import Button from '../Button';

const BtnUpgrade = ({
  account,
  messages,
  modalAdd,
  modalDismiss,
}) => (
  <Button
    size="link"
    onClick={() => modalAdd(
      <UpgradeDialog
        proxyContract={account.proxy}
        onSuccessButtonClick={modalDismiss}
      />
    )}
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
