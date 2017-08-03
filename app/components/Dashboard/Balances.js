import React from 'react';
import PropTypes from 'prop-types';

import {
  formatEth,
  formatNtz,
  formatAbp,
} from '../../utils/amountFormatter';

import WithLoading from '../WithLoading';

import { Bold, BalanceSection, BalanceWrapper } from './styles';

const Balances = ({
  babzBalance,
  pwrBalance,
  weiBalance,
}) => (
  <BalanceSection name="wallet-overview">
    <BalanceWrapper name="header">
      <Bold>Account Balances:</Bold>
    </BalanceWrapper>

    <BalanceWrapper name="nutz">
      <WithLoading
        isLoading={!babzBalance}
        loadingSize="14px"
        type="inline"
        styles={{ layout: { marginLeft: '15px' } }}
      >
        {babzBalance && formatNtz(babzBalance)} <Bold>NTZ</Bold>
      </WithLoading>
    </BalanceWrapper>

    <BalanceWrapper name="ether">
      <WithLoading
        isLoading={!weiBalance}
        loadingSize="14px"
        type="inline"
        styles={{ layout: { marginLeft: '15px' } }}
      >
        {weiBalance && formatEth(weiBalance)} <Bold>ETH</Bold>
      </WithLoading>
    </BalanceWrapper>

    <BalanceWrapper name="power">
      <WithLoading
        isLoading={!pwrBalance}
        loadingSize="14px"
        type="inline"
        styles={{ layout: { marginLeft: '15px' } }}
      >
        {pwrBalance && formatAbp(pwrBalance)} <Bold>ABP</Bold>
      </WithLoading>
    </BalanceWrapper>
  </BalanceSection>
);
Balances.propTypes = {
  babzBalance: PropTypes.object,
  pwrBalance: PropTypes.object,
  weiBalance: PropTypes.object,
};

export default Balances;
