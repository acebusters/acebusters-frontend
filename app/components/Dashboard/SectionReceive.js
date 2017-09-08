import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';

import messages from '../../containers/Dashboard/messages';
import AccountProgress from '../../containers/Dashboard/AccountProgress';
import WithLoading from '../WithLoading';
import { MAIN_NET_GENESIS_BLOCK, conf } from '../../app.config';

import Alert from '../Alert';

import BtnUpgrade from './BtnUpgrade';
import {
  Address,
  ReceiveWrapper,
  ReceiveSection,
} from './styles';

function handleChangellyClick(e) {
  e.preventDefault();
  window.open(e.currentTarget.href, 'Changelly', 'width=600,height=470,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0');
}

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
          margin: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <WithLoading
          isLoading={!account.proxy || account.proxy === '0x'}
          loadingSize="40px"
          styles={{
            layout: { transform: 'translateY(-50%)', left: 0 },
            outer: { margin: 'auto' },
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
          <Alert theme="success">
            <Address style={{ width: 180 }}>{account.proxy}</Address>
          </Alert>

          <a
            onClick={handleChangellyClick}
            href={`https://changelly.com/widget/v1?auth=email&from=BTC&to=ETH&merchant_id=${conf().changellyMerchantId}&address=${account.proxy}&amount=1&ref_id=${conf().changellyMerchantId}&color=cf0000`}
          >
            <img src="https://changelly.com/pay_button.png" alt="Changelly" />
          </a>
        </WithLoading>
      </ReceiveWrapper>

      <ReceiveWrapper>
        {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK &&
          <Alert theme="danger">
            <FormattedMessage {...messages.ethAlert} />
          </Alert>
        }

        {ethBalance && nutzBalance && floor &&
          <Alert theme="warning">
            <FormattedMessage values={{ limit: ETH_FISH_LIMIT.toString() }} {...messages.ethLimit} />
            <BtnUpgrade {...props} />
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
        alignSelf: 'flex-start',
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
      <Alert style={{ marginTop: 0, marginBottom: 10 }} theme="success">
        <Address>{account.proxy}</Address>
      </Alert>
      {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK &&
        <Alert theme="danger">
          <FormattedMessage {...messages.ethAlert} />
        </Alert>
      }
      <a
        onClick={handleChangellyClick}
        href={`https://changelly.com/widget/v1?auth=email&from=BTC&to=ETH&merchant_id=${conf().changellyMerchantId}&address=${account.proxy}&amount=1&ref_id=${conf().changellyMerchantId}&color=cf0000`}
      >
        <img src="https://changelly.com/pay_button.png" alt="Changelly" />
      </a>
    </ReceiveWrapper>
  </ReceiveSection>
);
AccountNotLocked.propTypes = {
  account: PropTypes.object,
  qrUrl: PropTypes.string,
};
