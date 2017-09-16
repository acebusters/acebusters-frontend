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
import Button from '../Button';
import FishWarningDialog from './FishWarningDialog';

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
                size="medium"
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
            <Alert theme="success">
              <Address style={{ width: 180 }}>{account.proxy}</Address>
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
      <Alert style={{ marginTop: 0, marginBottom: 10 }} theme="success">
        <Address>{account.proxy}</Address>
      </Alert>
      {conf().firstBlockHash !== MAIN_NET_GENESIS_BLOCK &&
        <Alert theme="danger">
          <FormattedMessage {...messages.ethAlert} />
        </Alert>
      }
    </ReceiveWrapper>
  </ReceiveSection>
);
AccountNotLocked.propTypes = {
  account: PropTypes.object,
  qrUrl: PropTypes.string,
};
