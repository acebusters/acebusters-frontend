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

import { ABP_DECIMALS } from '../../utils/amountFormatter';

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
    totalSupplyBabz,
    totalSupplyPwr,
    minPowerUpBabz,
    activeSupplyPwr,
  } = props;
  const disabledTabs = account.isLocked ? [POWERDOWN] : [];
  const adjTotalSupplyPwr = totalSupplyPwr.mul(2);
  const calcABPtoNTZ = (amount) => {
    const abpAmount = new BigNumber(amount);
    return abpAmount.div(adjTotalSupplyPwr).mul(totalSupplyBabz);
  };
  const calcNTZtoABP = (amount) => {
    const ntzAmount = new BigNumber(amount);
    return adjTotalSupplyPwr.mul(ntzAmount.div(totalSupplyBabz));
  };
  const totalAvailPwr = totalSupplyPwr.minus(activeSupplyPwr);
  const powerDownMinAbp = adjTotalSupplyPwr.div(minPowerUpBabz).div(ABP_DECIMALS).round(3, BigNumber.ROUND_UP);
  const powerUpRate = totalSupplyBabz.div(adjTotalSupplyPwr);
  // ensure that more ABP than exists can not be requested
  const powerUpMaxBabz = totalAvailPwr.mul(totalSupplyBabz.div(adjTotalSupplyPwr)).div(1000).round(0, BigNumber.ROUND_DOWN).mul(1000);
  // ensure that powerDown can be called even with minimum powerUp
  const powerUpMinNtz = calcABPtoNTZ(powerDownMinAbp).div(100).round(0).mul(100);
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
            powerDownMinAbp,
            calcABPtoNTZ,
            calcNTZtoABP,
            powerUpRate,
            powerUpMaxBabz,
            powerUpMinNtz,
            totalAvailPwr,
            ...props,
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
  totalSupplyBabz: PropTypes.object.isRequired,
  totalSupplyPwr: PropTypes.object.isRequired,
  minPowerUpBabz: PropTypes.number.isRequired,
  activeSupplyPwr: PropTypes.object.isRequired,
};
export default Invest;
