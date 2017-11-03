import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import H2 from 'components/H2';
import SubmitButton from 'components/SubmitButton';

const RebuyDialog = ({ messages, rebuy, modalDismiss }) => (
  <div style={{ minWidth: '20em' }}>
    <H2><FormattedMessage {...messages.sorry} /></H2>
    <p><FormattedMessage {...(rebuy ? messages.balanceOutRebuy : messages.balanceOutJoin)} /></p>
    <SubmitButton onClick={modalDismiss}>
      <FormattedMessage {...messages.ok} />
    </SubmitButton>
  </div>
);
RebuyDialog.propTypes = {
  messages: PropTypes.object,
  modalDismiss: PropTypes.func,
  rebuy: PropTypes.bool,
};

export default RebuyDialog;
