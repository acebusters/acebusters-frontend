import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';

import messages from '../../containers/Dashboard/messages';
import AccountProgress from '../../containers/Dashboard/AccountProgress';
import WithLoading from '../WithLoading';

import Alert from '../Alert';

import BtnUpgrade from './BtnUpgrade';
import {
  Address,
  ReceiveWrapper,
  ReceiveSection,
} from './styles';

export const AccountIsLocked = (props) => {
  const {
    ETH_FISH_LIMIT,
    account,
    ethBalance,
    nutzBalance,
    floor,
    qrUrl,
  } = props;
  return (
    <ReceiveSection>
      <ReceiveWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 10px',
          alignItems: 'center',
        }}
      >
        <WithLoading
          isLoading={!account.proxy || account.proxy === '0x'}
          loadingSize="40px"
          styles={{
            layout: { transform: 'translateY(-50%)', left: 0 },
            outer: { marginTop: '20%' },
          }}
        >
          <QRCode value={qrUrl} size={100} />
        </WithLoading>
        <WithLoading
          isLoading={!account.proxy || account.proxy === '0x'}
          loadingSize="40px"
          styles={{
            layout: { transform: 'translateY(-50%)', left: 0 },
            outer: { marginTop: 'auto' },
          }}
        >
          <Alert style={{ width: 220 }} theme="success">
            <Address>{account.proxy}</Address>
          </Alert>
        </WithLoading>
      </ReceiveWrapper>

      <ReceiveWrapper>
        <Alert theme="danger">
          <FormattedMessage {...messages.ethAlert} />
        </Alert>

        {ethBalance && nutzBalance && floor &&
          <Alert theme="warning">
            Warning: account limit {ETH_FISH_LIMIT.toString()} ETH<br />
            <BtnUpgrade {...props} /> to deposit more.
            <AccountProgress
              ethBalance={ethBalance}
              nutzBalance={nutzBalance}
              floor={floor}
              ethLimit={ETH_FISH_LIMIT}
            />
          </Alert>
        }
      </ReceiveWrapper>
    </ReceiveSection>
  );
};
AccountIsLocked.propTypes = {
  ETH_FISH_LIMIT: PropTypes.object,
  account: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  floor: PropTypes.object,
  qrUrl: PropTypes.string,
};

export const AccountNotLocked = ({
  account,
  qrUrl,
}) => (
  <ReceiveSection>
    <ReceiveWrapper
      style={{
        alignSelf: 'center',
        margin: '0 12px',
      }}
    >
      <WithLoading
        isLoading={!account.proxy || account.proxy === '0x'}
        loadingSize="40px"
        styles={{ layout: { transform: 'translateY(-50%)', left: 0 } }}
      >
        <QRCode
          value={qrUrl}
          size={100}
        />
      </WithLoading>
    </ReceiveWrapper>

    <ReceiveWrapper>
      <Alert style={{ marginTop: 15, marginBottom: 0 }} theme="success">
        <Address>{account.proxy}</Address>
      </Alert>
      <Alert theme="danger">
        <FormattedMessage {...messages.ethAlert} />
      </Alert>
    </ReceiveWrapper>
  </ReceiveSection>
);
AccountNotLocked.propTypes = {
  account: PropTypes.object,
  qrUrl: PropTypes.string,
};
