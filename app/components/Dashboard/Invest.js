import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { FormattedMessage } from 'react-intl';

import { POWERUP, POWERDOWN } from '../../containers/Dashboard/actions';
import messages from '../../containers/Dashboard/messages';

import Tabs from './Tabs';
import PanesRoot from './PanesRoot';
import PowerUp from './PowerUp';
import PowerDown from './PowerDown';
import { Pane, Section } from './styles';

import { toNtz } from '../../utils/amountFormatter';

const TABS = [
  {
    name: POWERUP,
    title: <FormattedMessage {...messages.powerUpTitle} />,
    icon: 'fa fa-arrow-up',
  },
  {
    name: POWERDOWN,
    title: <FormattedMessage {...messages.powerDownTitle} />,
    icon: 'fa fa-arrow-down',
  },
];

const PANES = {
  [POWERUP]: PowerUp,
  [POWERDOWN]: PowerDown,
};

const Invest = (props) => {
  const {
    account,
    setInvestType,
    investType,
    completeSupplyBabz,
    totalSupplyPwr,
    activeSupplyPwr,
    minPowerUpBabz,
    pwrBalance,
    nutzBalance,
    handlePowerUp,
    estimatePowerUp,
    handlePowerDown,
    estimatePowerDown,
  } = props;
  const disabledTabs = account.isLocked ? [POWERDOWN] : [];
  const adjTotalSupplyPwr = totalSupplyPwr.mul(2);
  const calcABPtoNTZ = (amount) => {
    const abpAmount = new BigNumber(amount);
    return abpAmount.div(adjTotalSupplyPwr).mul(completeSupplyBabz);
  };
  const calcNTZtoABP = (amount) => {
    const ntzAmount = new BigNumber(amount);
    return adjTotalSupplyPwr.mul(ntzAmount.div(completeSupplyBabz));
  };
  const totalAvailPwr = totalSupplyPwr.minus(activeSupplyPwr);
  const powerDownMinAbp = calcNTZtoABP(toNtz(minPowerUpBabz));
  const powerUpRate = completeSupplyBabz.div(adjTotalSupplyPwr);
  // ensure that more ABP than exists can not be requested
  const powerUpMaxBabz = totalAvailPwr.mul(completeSupplyBabz.div(adjTotalSupplyPwr)).div(1000).round(0, BigNumber.ROUND_DOWN).mul(1000);
  // ensure that powerDown can be called even with minimum powerUp
  const powerUpMinNtz = toNtz(minPowerUpBabz);
  return (
    <Pane name="dashboard-invest">
      <Section >
        <Tabs
          tabs={TABS}
          activeTab={investType}
          setActiveTab={setInvestType}
          disabledTabs={disabledTabs}
        />
        <PanesRoot
          panes={PANES}
          paneType={investType}
          paneProps={{
            account,
            powerDownMinAbp,
            calcABPtoNTZ,
            calcNTZtoABP,
            powerUpRate,
            nutzBalance,
            powerUpMaxBabz,
            powerUpMinNtz,
            totalAvailPwr,
            messages,
            handlePowerUp,
            estimatePowerUp,
            handlePowerDown,
            estimatePowerDown,
            pwrBalance,
          }}
        />
      </Section>
    </Pane>
  );
};
Invest.propTypes = {
  account: PropTypes.object.isRequired,
  investType: PropTypes.oneOf([POWERUP, POWERDOWN]).isRequired,
  setInvestType: PropTypes.func.isRequired,
  completeSupplyBabz: PropTypes.object.isRequired,
  totalSupplyPwr: PropTypes.object.isRequired,
  minPowerUpBabz: PropTypes.object.isRequired,
  activeSupplyPwr: PropTypes.object.isRequired,
  pwrBalance: PropTypes.object.isRequired,
  nutzBalance: PropTypes.object.isRequired,
  handlePowerUp: PropTypes.func.isRequired,
  estimatePowerUp: PropTypes.func.isRequired,
  handlePowerDown: PropTypes.func.isRequired,
  estimatePowerDown: PropTypes.func.isRequired,
};
export default Invest;
