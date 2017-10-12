import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { ABP_DECIMALS } from '../../utils/amountFormatter';
import ExchangeDialog from '../../containers/ExchangeDialog';
import { ABP, NTZ } from '../../containers/Dashboard/actions';

import FormField from '../Form/FormField';
import Alert from '../Alert';

import { Description } from './styles';

const PowerDown = (props) => {
  const {
    messages,
    pwrBalance,
    handlePowerDown,
    powerDownMinAbp,
    calcABPtoNTZ,
  } = props;
  return (
    <div>
      <Description>
        <FormattedHTMLMessage {...messages.powerDownDescr} />
        <Alert theme="info">
          <FormattedMessage
            values={{ min: powerDownMinAbp.round(3, BigNumber.ROUND_UP).toFormat(3) }}
            {...messages.powerDownMin}
          />
        </Alert>
      </Description>
      {pwrBalance && pwrBalance.equals(0) ?
        <Alert theme="warning">
          <FormattedMessage {...messages.powerDownPrereq} />
        </Alert>
        :
        <ExchangeDialog
          form="exchangeABPtoNTZ"
          handleExchange={handlePowerDown}
          maxAmount={pwrBalance.div(ABP_DECIMALS)}
          minAmount={powerDownMinAbp}
          hideAddress
          label={<FormattedMessage {...messages.powerDownAmountLabel} />}
          calcExpectedAmount={(num) => calcABPtoNTZ(num).toFormat(0)}
          expectedAmountUnit={NTZ}
          amountUnit={ABP}
          placeholder="0.000"
          component={FormField}
          {...props}
        />
      }
    </div>
  );
};
PowerDown.propTypes = {
  messages: PropTypes.object.isRequired,
  handlePowerDown: PropTypes.func.isRequired,
  pwrBalance: PropTypes.object,
  powerDownMinAbp: PropTypes.object.isRequired,
  calcABPtoNTZ: PropTypes.func.isRequired,
};

export default PowerDown;
