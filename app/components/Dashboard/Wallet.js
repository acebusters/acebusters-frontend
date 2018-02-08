import React from 'react';
import PropTypes from 'prop-types';

import { NTZ } from '../../containers/Dashboard/actions';
import TransferDialog from '../../containers/TransferDialog';

import H2 from '../H2';

import {
  Pane,
  Section,
  SendContainer,
  TabIcon as ModeIcon,
} from './styles';

function Wallet(props) {
  const {
    nutzBalance,
    handleNTZTransfer,
    estimateNTZTransfer,
  } = props;

  return (
    <Pane name="dashboard-wallet">
      <Section name="wallet-send">
        <H2><ModeIcon className="fa fa-send" />Transfer</H2>
        <SendContainer>
          {nutzBalance &&
            <TransferDialog
              handleTransfer={handleNTZTransfer}
              estimateTransfer={estimateNTZTransfer}
              maxAmount={nutzBalance.round(4)}
              type="token"
              placeholder="0"
              messages={props.messages}
              amountUnit={NTZ}
              form="transfer-ntz"
            />
          }
        </SendContainer>
      </Section>
    </Pane>
  );
}

Wallet.propTypes = {
  nutzBalance: PropTypes.object,
  handleNTZTransfer: PropTypes.func,
  estimateNTZTransfer: PropTypes.func,
  messages: PropTypes.object,
};

export default Wallet;
