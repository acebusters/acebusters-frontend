import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { ABP_DECIMALS } from '../../utils/amountFormatter';
import TransferDialog from '../../containers/TransferDialog';

import Alert from '../Alert';

import { Description } from './styles';

const PowerDown = (props) => {
  const {
    messages,
    totalSupplyPwr,
    pwrBalance,
    handlePowerDown,
  } = props;
  const minPowerDownPwr = totalSupplyPwr.div(10000).div(ABP_DECIMALS).ceil();
  return (
    <div>
      <Description>
        <FormattedHTMLMessage
          {...messages.powerDownDescr}
          values={{
            min: minPowerDownPwr,
          }}
        />
      </Description>
      {pwrBalance && pwrBalance.equals(0) ?
        <Alert theme="warning">
          <FormattedMessage {...messages.powerDownPrereq} />
        </Alert>
        :
        <TransferDialog
          handleTransfer={handlePowerDown}
          maxAmount={pwrBalance.div(ABP_DECIMALS)}
          minAmount={minPowerDownPwr}
          hideAddress
          label={<FormattedMessage {...messages.powerDownAmountLabel} />}
          amountUnit="ABP"
          placeholder="0.00"
          {...props}
        />
      }
    </div>
  );
};
PowerDown.propTypes = {
  messages: PropTypes.object.isRequired,
  totalSupplyPwr: PropTypes.object.isRequired,
  handlePowerDown: PropTypes.func.isRequired,
  pwrBalance: PropTypes.object,
};

export default PowerDown;
