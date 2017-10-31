import React from 'react';
import PropTypes from 'prop-types';
import ethUtil from 'ethereumjs-util';
import { FormattedMessage } from 'react-intl';

import BtnUpgrade from 'containers/Button/BtnUpgrade';
import messages from '../../containers/Dashboard/messages';
import AccountProgress from '../../containers/Dashboard/AccountProgress';
import { MAIN_NET_GENESIS_BLOCK, ETH_FISH_LIMIT, conf } from '../../app.config';
import shapeshiftButton from './shapeshift.png';

import Alert from '../Alert';

import DepositInfo from './DepositInfo';
import { ReceiveSection } from './styles';

function handleShapeshiftClick(e) {
  e.preventDefault();
  window.open(
    e.currentTarget.href,
    conf().shapeshiftKey,
    'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0'
  );
}

const shapeShiftLink = (proxy) =>
  `https://shapeshift.io/shifty.html?destination=${proxy}&output=ETH&apiKey=${conf()
    .shapeshiftKey}`;

export const SectionReceive = (props) => {
  const { account, ethBalance, nutzBalance, floor } = props;
  return (
    <ReceiveSection>
      <DepositInfo />

      {conf().firstBlockHash === MAIN_NET_GENESIS_BLOCK && (
        <a
          onClick={handleShapeshiftClick}
          href={shapeShiftLink(ethUtil.toChecksumAddress(account.proxy))}
        >
          <img src={shapeshiftButton} alt="Pay with Shapeshift" />
        </a>
      )}

      {account.isLocked &&
        ethBalance &&
        nutzBalance &&
        floor && (
          <Alert theme="warning" data-tour="wallet-unlock">
            <FormattedMessage
              values={{ limit: ETH_FISH_LIMIT.toString() }}
              {...messages.ethLimit}
            />
            <BtnUpgrade {...{ account, messages }} />
            <AccountProgress
              ethBalance={ethBalance}
              nutzBalance={nutzBalance}
              floor={floor}
              ethLimit={ETH_FISH_LIMIT}
            />
          </Alert>
        )}
    </ReceiveSection>
  );
};
SectionReceive.propTypes = {
  account: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  floor: PropTypes.object,
};

export default SectionReceive;
