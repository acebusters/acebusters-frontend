import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import BtnUpgrade from 'containers/Button/BtnUpgrade';
import { formatAmount, toNtz, ABP_DECIMALS } from '../../utils/amountFormatter';

import { ABP, NTZ } from '../../containers/Dashboard/actions';
import ExchangeDialog from '../../containers/ExchangeDialog';

import FormField from '../Form/FormField';
import Alert from '../Alert';

import { Description } from './styles';

const PowerUp = (props) => {
  const {
    messages,
    account,
    nutzBalance,
    handlePowerUp,
    estimatePowerUp,
    totalAvailPwr,
    powerUpRate,
    powerUpMaxBabz,
    powerUpMinNtz,
    calcNTZtoABP,
  } = props;
  return (
    <div>
      <Description>
        <FormattedHTMLMessage {...messages.powerUpDescr} />
        <Alert theme="info" style={{ textAlign: 'center' }}>
          <FormattedMessage
            {...messages.powerUpAvailable}
            values={{ amount: formatAmount(ABP_DECIMALS, totalAvailPwr, 0) }}
          />
        </Alert>
        <Alert theme="info" style={{ textAlign: 'center' }}>
          <FormattedMessage
            {...messages.powerUpRate}
            values={{ amount: powerUpRate.toFormat(0) }}
          />
        </Alert>
        <Alert theme="info" style={{ textAlign: 'center' }}>
          <FormattedMessage
            {...messages.powerUpMinAmount}
            values={{ amount: powerUpMinNtz.round(0, BigNumber.ROUND_UP).toFormat(0) }}
          />
        </Alert>
      </Description>
      {!account.isLocked &&
        <ExchangeDialog
          form="exchangeNTZtoABP"
          handleExchange={handlePowerUp}
          estimateExchange={estimatePowerUp}
          maxAmount={(nutzBalance || toNtz(powerUpMaxBabz)).round(4, BigNumber.ROUND_UP)}
          minAmount={powerUpMinNtz.round(0, BigNumber.ROUND_UP)}
          label={<FormattedMessage {...messages.powerUpAmountLabel} />}
          hideAddress
          amountUnit={NTZ}
          placeholder="0"
          calcExpectedAmount={(num) => calcNTZtoABP(num).toFormat(3)}
          expectedAmountUnit={ABP}
          component={FormField}
          {...props}
        />
      }
      {account.isLocked &&
        <Alert theme="warning">
          <BtnUpgrade {...{ account, messages }} />&nbsp;to Power Up.
        </Alert>
      }
    </div>
  );
};
PowerUp.propTypes = {
  account: PropTypes.object,
  nutzBalance: PropTypes.object,
  messages: PropTypes.object.isRequired,
  handlePowerUp: PropTypes.func,
  estimatePowerUp: PropTypes.func,
  totalAvailPwr: PropTypes.object.isRequired,
  powerUpRate: PropTypes.object.isRequired,
  powerUpMaxBabz: PropTypes.object.isRequired,
  powerUpMinNtz: PropTypes.object.isRequired,
  calcNTZtoABP: PropTypes.func.isRequired,
};

export default PowerUp;
