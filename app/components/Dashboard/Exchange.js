import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

import { NTZ_DECIMALS, ETH_DECIMALS, formatNtz, formatEth } from '../../utils/amountFormatter';
import { round } from '../../utils';

import ExchangeDialog from '../../containers/ExchangeDialog';
import { ETH, NTZ } from '../../containers/Dashboard/actions';

import TokenAmountField from '../Form/TokenAmountField';
import Alert from '../Alert';

import { Pane, Section, ExchangeContainer } from './styles';

import { ETH_FISH_LIMIT } from '../../app.config';

const Exchange = (props) => {
  const {
    amountUnit,
    messages,
    account,
    ethBalance,
    nutzBalance,
    ceiling,
    floor,
    handleNTZSell,
    estimateNTZSell,
    handleNTZPurchase,
    estimateNTZPurchase,
  } = props;
  const calcETHAmount = (ntz) => new BigNumber(ntz.toString()).div(floor);
  const calcNTZAmount = (eth) => ceiling.mul(eth.toString());
  const calcExpectedAmountETH = (amount) => formatEth(calcETHAmount(round(amount, 8)).mul(ETH_DECIMALS));
  const calcExpectedAmountNTZ = (amount) => formatNtz(calcNTZAmount(round(amount, 8)).mul(NTZ_DECIMALS));
  return (
    <Pane name="dashboard-exchange" >
      <Section>
        <ExchangeContainer>
          {amountUnit === NTZ && nutzBalance && floor &&
            <ExchangeDialog
              form="exchangeNTZtoETH"
              component={TokenAmountField}
              label={<FormattedMessage {...messages.amount} />}
              title={<FormattedMessage {...messages.sellTitle} />}
              descr={
                <Alert theme="info" style={{ textAlign: 'center' }}>
                  <FormattedMessage
                    {...messages.floorPrice}
                    values={{ amount: formatNtz(floor.mul(NTZ_DECIMALS)) }}
                  />
                </Alert>
              }
              amountUnit={NTZ}
              calcExpectedAmount={calcExpectedAmountETH}
              handleExchange={handleNTZSell}
              estimateExchange={estimateNTZSell}
              maxAmount={BigNumber.min(
                account.isLocked
                  ? BigNumber.max(ETH_FISH_LIMIT.sub(ethBalance), 0).mul(floor)
                  : nutzBalance,
                nutzBalance
              )}
              placeholder="0"
              expectedAmountUnit={ETH}
              messages={props.messages}
            />
          }
          {amountUnit === ETH && ethBalance && ceiling &&
            <ExchangeDialog
              form="exchangeETHtoNTZ"
              component={TokenAmountField}
              label={<FormattedMessage {...messages.amount} />}
              title={<FormattedMessage {...messages.purchaseTitle} />}
              descr={
                <Alert theme="info" style={{ textAlign: 'center' }}>
                  <FormattedMessage
                    {...messages.ceilingPrice}
                    values={{ amount: formatNtz(ceiling.mul(NTZ_DECIMALS)) }}
                  />
                </Alert>
              }
              amountUnit={ETH}
              calcExpectedAmount={calcExpectedAmountNTZ}
              handleExchange={handleNTZPurchase}
              estimateExchange={estimateNTZPurchase}
              maxAmount={BigNumber.min(
                account.isLocked
                  ? BigNumber.max(ETH_FISH_LIMIT.sub(calcETHAmount(nutzBalance)), 0)
                  : ethBalance,
                ethBalance
              )}
              placeholder="0.00"
              expectedAmountUnit={NTZ}
              messages={props.messages}
            />
          }
        </ExchangeContainer>
      </Section>
    </Pane>
  );
};
Exchange.propTypes = {
  amountUnit: PropTypes.oneOf([ETH, NTZ]),
  account: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  messages: PropTypes.object,
  ceiling: PropTypes.object,
  floor: PropTypes.object,
  handleNTZSell: PropTypes.func,
  estimateNTZSell: PropTypes.func,
  handleNTZPurchase: PropTypes.func,
  estimateNTZPurchase: PropTypes.func,
};

export default Exchange;
