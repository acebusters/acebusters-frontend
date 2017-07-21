import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

import { ABP_DECIMALS } from '../../utils/amountFormatter';

import ExchangeDialog from '../../containers/ExchangeDialog';
import TransferDialog from '../../containers/TransferDialog';
import messages from '../../containers/Dashboard/messages';
import { DBButton } from '../../containers/Dashboard/styles';

import H2 from '../H2';

import { Pane, Section, ExchangeContainer } from './styles';

const Exchange = ({
  ETH_FISH_LIMIT,
  account,
  babzBalance,
  ethBalance,
  calcETHAmount,
  calcNTZAmount,
  nutzBalance,
  ceiling,
  floor,
  handleNTZSell,
  handleNTZPurchase,
  handlePowerUp,
  handlePowerDown,
  modalAdd,
  pwrBalance,
  weiBalance,
}) => (
  <Pane name="dashboard-exchange" >
    <Section>
      <H2>Acebuster Nutz (NTZ/ETH)</H2>
      <ExchangeContainer>
        {babzBalance && floor &&
          <DBButton
            onClick={() => modalAdd(
              <ExchangeDialog
                title={<FormattedMessage {...messages.sellTitle} />}
                amountUnit="ntz"
                calcExpectedAmount={calcETHAmount}
                handleExchange={handleNTZSell}
                maxAmount={BigNumber.min(
                  account.isLocked
                    ? BigNumber.max(ETH_FISH_LIMIT.sub(ethBalance), 0).mul(floor)
                    : nutzBalance,
                  nutzBalance
                )}
              />
            )}
            size="medium"
          >
            Sell
          </DBButton>
        }
        {weiBalance && ceiling &&
          <DBButton
            onClick={() => modalAdd(
              <ExchangeDialog
                title={<FormattedMessage {...messages.purchaseTitle} />}
                amountUnit="eth"
                calcExpectedAmount={calcNTZAmount}
                handleExchange={handleNTZPurchase}
                maxAmount={BigNumber.min(
                  account.isLocked
                    ? BigNumber.max(ETH_FISH_LIMIT.sub(calcETHAmount(nutzBalance)), 0)
                    : ethBalance,
                  ethBalance
                )}
              />
            )}
            size="medium"
          >
            Purchase
          </DBButton>
        }
      </ExchangeContainer>
    </Section>

    <Section>
      <H2>Acebuster Power (ABP/NTZ)</H2>
      <ExchangeContainer>
        {babzBalance &&
          <DBButton
            onClick={() => modalAdd(
              <TransferDialog
                handleTransfer={handlePowerUp}
                maxAmount={nutzBalance}
                hideAddress
                title={<FormattedMessage {...messages.powerUpTitle} />}
                amountUnit="NTZ"
              />
            )}
            size="medium"
            disabled={account.isLocked}
          >
            Power Up
          </DBButton>
        }

        {pwrBalance &&
          <DBButton
            onClick={() => modalAdd(
              <TransferDialog
                title={<FormattedMessage {...messages.powerDownTitle} />}
                description="Power Down will convert ABP back to NTZ over a period of 3 month"
                handleTransfer={handlePowerDown}
                maxAmount={pwrBalance.div(ABP_DECIMALS)}
                hideAddress
                amountUnit="ABP"
              />
            )}
            size="medium"
            disabled={account.isLocked}
          >
            Power Down
          </DBButton>
        }
      </ExchangeContainer>
    </Section>
  </Pane>
);
Exchange.propTypes = {
  ETH_FISH_LIMIT: PropTypes.object,
  account: PropTypes.object,
  babzBalance: PropTypes.object,
  ethBalance: PropTypes.object,
  calcETHAmount: PropTypes.func,
  calcNTZAmount: PropTypes.func,
  nutzBalance: PropTypes.object,
  ceiling: PropTypes.object,
  floor: PropTypes.object,
  handleNTZSell: PropTypes.func,
  handleNTZPurchase: PropTypes.func,
  handlePowerDown: PropTypes.func,
  handlePowerUp: PropTypes.func,
  modalAdd: PropTypes.func,
  pwrBalance: PropTypes.object,
  weiBalance: PropTypes.object,
};

export default Exchange;
