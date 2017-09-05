import React from 'react';
import PropTypes from 'prop-types';

import { ETH } from '../../containers/Dashboard/actions';
import TransferDialog from '../../containers/TransferDialog';

import H2 from '../H2';

import {
  Pane,
  Section,
  SendContainer,
  TabIcon as ModeIcon,
} from './styles';
import { AccountIsLocked, AccountNotLocked } from './SectionReceive';

function Wallet(props) {
  const {
    account,
    // babzBalance,
    ethBalance,
    nutzBalance,
    handleNTZTransfer,
    handleETHTransfer,
    amountUnit,
    // weiBalance,
  } = props;

  return (
    <Pane name="dashboard-wallet">
      <Section
        style={{ alignSelf: 'center', maxWidth: 480 }}
        name="wallet-receive"
      >
        <H2><ModeIcon className="fa fa-inbox" />Deposit</H2>
        {account.isLocked ?
          <AccountIsLocked {...props} />
          :
          <AccountNotLocked {...props} />
        }
      </Section>

      <Section name="wallet-send">
        <H2><ModeIcon className="fa fa-send" />Transfer</H2>
        <SendContainer>
          {amountUnit === ETH ?
            <TransferDialog
              handleTransfer={handleETHTransfer}
              maxAmount={ethBalance}
              type="token"
              placeholder="0.00"
              {...props}
            />
            :
            <TransferDialog
              handleTransfer={handleNTZTransfer}
              maxAmount={nutzBalance}
              type="token"
              placeholder="0"
              {...props}
            />
          }
        </SendContainer>
      </Section>
    </Pane>
  );
}

Wallet.propTypes = {
  account: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  handleNTZTransfer: PropTypes.func,
  handleETHTransfer: PropTypes.func,
  amountUnit: PropTypes.string,
};

export default Wallet;
