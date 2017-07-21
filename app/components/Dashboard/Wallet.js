import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { DBButton } from '../../containers/Dashboard/styles';
import messages from '../../containers/Dashboard/messages';
import TransferDialog from '../../containers/TransferDialog';

import H2 from '../H2';

import {
  Pane,
  Section,
  SendContainer,
  TabIcon as ModeIcon,
} from './styles';

const Wallet = ({
  babzBalance,
  ethBalance,
  nutzBalance,
  handleNTZTransfer,
  handleETHTransfer,
  modalAdd,
  weiBalance,
}) => (
  <Pane name="dashboard-wallet">
    <Section name="wallet-send">
      <H2><ModeIcon className="fa fa-send" />Transfer</H2>
      <SendContainer>
        {babzBalance &&
          <DBButton
            onClick={() => modalAdd(
              <TransferDialog
                title={<FormattedMessage {...messages.ntzTransferTitle} />}
                handleTransfer={handleNTZTransfer}
                maxAmount={nutzBalance}
                amountUnit="NTZ"
              />
            )}
            size="medium"
          >
            Nutz
          </DBButton>
        }
        {weiBalance &&
          <DBButton
            onClick={() => modalAdd(
              <TransferDialog
                title={<FormattedMessage {...messages.ethTransferTitle} />}
                handleTransfer={handleETHTransfer}
                maxAmount={ethBalance}
                amountUnit="ETH"
              />
            )}
            size="medium"
          >
            Ether
          </DBButton>
        }
      </SendContainer>
    </Section>

  </Pane>
);
Wallet.propTypes = {
  babzBalance: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  handleNTZTransfer: PropTypes.func,
  handleETHTransfer: PropTypes.func,
  modalAdd: PropTypes.func,
  weiBalance: PropTypes.object,
};

export default Wallet;
