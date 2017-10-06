import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import ethUtil from 'ethereumjs-util';
import { FormattedMessage } from 'react-intl';

import messages from '../../containers/Dashboard/messages';
import AccountProgress from '../../containers/Dashboard/AccountProgress';
import WithLoading from '../WithLoading';
import { MAIN_NET_GENESIS_BLOCK, conf } from '../../app.config';
import shapeshiftButton from './shapeshift.png';

import Alert from '../Alert';

import BtnUpgrade from './BtnUpgrade';
import {
  Address,
  ReceiveWrapper,
  ReceiveSection,
} from './styles';
import Button from '../Button';
import FishWarningDialog from './FishWarningDialog';

function handleShapeshiftClick(e) {
  e.preventDefault();
  window.open(e.currentTarget.href, conf().shapeshiftKey, 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0');
}

const shapeShiftLink = (proxy) => `https://shapeshift.io/shifty.html?destination=${proxy}&output=ETH&apiKey=${conf().shapeshiftKey}`;

export const AccountIsLocked = (props) => {
  const {
    ETH_FISH_LIMIT,
    account,
    ethBalance,
    nutzBalance,
    floor,
    qrUrl,
    modalAdd,
    modalDismiss,
    isFishWarned,
    fishWarn,
  } = props;
  const qrStyles = isFishWarned
    ? { margin: 'auto' }
    : { margin: 'auto', filter: 'blur(4px)', opacity: '.4' };
  return (
    <ReceiveSection>
      <ReceiveWrapper
        style={{
          margin: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!isFishWarned &&
          <span style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                zIndex: '1',
                textAlign: 'center',
                top: '70px',
                width: '100%',
              }}
            >
              <Button
                size="small"
                onClick={() => modalAdd(
                  <FishWarningDialog
                    onSuccessButtonClick={() => {
                      modalDismiss();
                      fishWarn();
                    }}
                  />
                )}
              >
                Deposit
              </Button>
            </span>
          </span>
        }
        <WithLoading
          isLoading={!account.proxy || account.proxy === '0x'}
          loadingSize="40px"
          styles={{
            layout: { transform: 'translateY(-50%)', left: 0 },
            outer: qrStyles,
          }}
        >
          <QRCode value={qrUrl} size={100} />
        </WithLoading>
        {isFishWarned &&
          <WithLoading
            isLoading={!account.proxy || account.proxy === '0x'}
            loadingSize="40px"
            styles={{
              layout: { transform: 'translateY(-50%)', left: 0 },
              outer: { marginTop: 'auto' },
            }}
          >
            <Alert theme="success" data-tour="wallet-address">
              <Address style={{ width: 180 }}>{ethUtil.toChecksumAddress(account.proxy)}</Address>
            </Alert>
          </WithLoading>
        }
      </ReceiveWrapper>

      <ReceiveWrapper>
        {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK &&
          <Alert theme="danger">
            <FormattedMessage {...messages.ethAlert} />
          </Alert>
        }

        <Alert theme="warning">
          Please note you´ll need some amount of ETH in your MetaMask wallet if you want to unlock account and pay transaction fees after unlock (table joins, transfers etc). Depending on the gas price you will need to pay ≈0.004 ETH to join the table.
        </Alert>

        {ethBalance && nutzBalance && floor &&
          <Alert theme="warning" data-tour="wallet-unlock">
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
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
  isFishWarned: PropTypes.bool,
  fishWarn: PropTypes.func,
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
      <Alert
        style={{ marginTop: 0, marginBottom: 10 }}
        theme="success"
        data-tour="wallet-address"
      >
        <Address>{ethUtil.toChecksumAddress(account.proxy)}</Address>
      </Alert>
      {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK &&
        <Alert theme="danger">
          <FormattedMessage {...messages.ethAlert} />
        </Alert>
      }

      {conf().firstBlockHash === MAIN_NET_GENESIS_BLOCK &&
        <a
          onClick={handleShapeshiftClick}
          href={shapeShiftLink(ethUtil.toChecksumAddress(account.proxy))}
        >
          <img src={shapeshiftButton} alt="Pay with Shapeshift" />
        </a>
      }

      <Alert theme="warning">
      Please note you´ll need some amount of ETH in your MetaMask wallet to pay transaction fees (table joins, transfers etc). Depending on the gas price you will need to pay ≈0.004 ETH to join the table.
      </Alert>
    </ReceiveWrapper>
  </ReceiveSection>
);
AccountNotLocked.propTypes = {
  account: PropTypes.object,
  qrUrl: PropTypes.string,
};
