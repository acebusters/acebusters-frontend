import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import ethUtil from 'ethereumjs-util';
import { FormattedMessage } from 'react-intl';
import messages from 'containers/Dashboard/messages';
import SubmitButton from 'components/SubmitButton';
import CopyInput from 'components/CopyInput';
import {
  DialogContents,
  DialogTitle,
  DialogButtonWrapper,
} from 'components/Modal/styles';
import Alert from '../Alert';
import WithLoading from '../WithLoading';
import { MAIN_NET_GENESIS_BLOCK, conf } from '../../app.config';

const styles = {
  withLoadingOuter: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  address: {
    fontSize: '1.2em',
    width: '100%',
    textAlign: 'center',
    padding: '12px 0 16px 0',
    margin: '5px 0',
  },
  alertMargins: {
    margin: '5px 0',
  },
  qrCodeWrapper: {
    margin: '0 0 16px 0',
  },
};

const DepositDialog = ({ account, handleClose }) => {
  const qrUrl = `ether:${account.proxy}`;
  return (
    <DialogContents>
      <Alert style={styles.address} theme="none">
        <DialogTitle>Ethereum and Nutz Deposit</DialogTitle>
        <WithLoading
          isLoading={!account.proxy || account.proxy === '0x'}
          loadingSize="40px"
          styles={{ outer: styles.withLoadingOuter }}
        >
          <div style={styles.qrCodeWrapper}>
            <QRCode value={qrUrl} size={160} />
          </div>
          <CopyInput value={ethUtil.toChecksumAddress(account.proxy)} />
        </WithLoading>
      </Alert>

      {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK && (
        <Alert style={styles.alertMargins} theme="danger">
          <FormattedMessage {...messages.ethAlert} />
        </Alert>
      )}

      {false &&
        <Alert style={styles.alertMargins} theme="warning">
          Please note you{'\''}ll need some amount of ETH in your MetaMask wallet if
          you want to unlock account and pay transaction fees after unlock (table
          joins, transfers etc). Depending on the gas price you will need to pay
          ≈0.004 ETH to join the table.
        </Alert>
      }

      <DialogButtonWrapper>
        <SubmitButton onClick={handleClose}>OK</SubmitButton>
      </DialogButtonWrapper>
    </DialogContents>
  );
};
DepositDialog.propTypes = {
  account: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DepositDialog;
