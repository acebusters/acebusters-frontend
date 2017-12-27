import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import { modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import {
  NTZ_DECIMALS,
  toNtz,
} from '../../utils/amountFormatter';
import { notifyCreate } from '../Notifications/actions';

import makeSelectAccountData, {
  makeSignerAddrSelector,
  makeSelectPrivKey,
  makeBlockySelector,
  makeNickNameSelector,
} from '../AccountProvider/selectors';
import { POWERUP, setAmountUnit } from './actions';
import messages from './messages';
import {
  getActiveTab,
  getAmountUnit,
  getInvestType,
  getInvestTour,
  createDashboardTxsSelector,
} from './selectors';

import PowerUpComponent from '../../components/Dashboard/PowerUp';

import {
  ABI_CONTROLLER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  conf,
} from '../../app.config';

const confParams = conf();

class PowerUp extends React.Component {
  constructor(props) {
    super(props);

    this.handlePowerUp = this.handlePowerUp.bind(this);
    this.estimatePowerUp = this.estimatePowerUp.bind(this);

    this.web3 = props.web3Redux.web3;
    this.controller = this.web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(confParams.contrAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.power = this.web3.eth.contract(ABI_POWER_CONTRACT).at(confParams.pwrAddr);
  }

  handleTxSubmit(txFn) {
    return new Promise((resolve, reject) => {
      txFn((err, result) => {
        this.props.modalDismiss();
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  handlePowerUp(amount) {
    this.props.notifyCreate(POWERUP, { amount });
    return this.handleTxSubmit((callback) => {
      this.token.powerUp.sendTransaction(
        new BigNumber(amount).mul(NTZ_DECIMALS),
        callback
      );
    });
  }

  estimatePowerUp(amount) {
    return this.token.powerUp.estimateGas(
      new BigNumber(amount).mul(NTZ_DECIMALS),
    );
  }

  render() {
    const { account } = this.props;
    const babzBalance = this.token.balanceOf(account.proxy);
    const completeSupplyBabz = this.controller.completeSupply();
    const activeSupplyPwr = this.power.activeSupply();
    const minPowerUpBabz = this.controller.minimumPowerUpSizeBabz();
    const totalSupplyPwr = this.power.totalSupply();

    if (!completeSupplyBabz || !activeSupplyPwr || !minPowerUpBabz || !totalSupplyPwr) {
      return null;
    }

    const adjTotalSupplyPwr = totalSupplyPwr.mul(2);
    const calcNTZtoABP = (amount) => {
      const ntzAmount = new BigNumber(amount);
      return adjTotalSupplyPwr.mul(ntzAmount.div(completeSupplyBabz));
    };
    const totalAvailPwr = totalSupplyPwr.sub(activeSupplyPwr);
    const powerUpRate = completeSupplyBabz.div(adjTotalSupplyPwr);
    // ensure that more ABP than exists can not be requested
    const powerUpMaxBabz = totalAvailPwr.mul(completeSupplyBabz.div(adjTotalSupplyPwr)).div(1000).round(0, BigNumber.ROUND_DOWN).mul(1000);
    // ensure that powerDown can be called even with minimum powerUp
    const powerUpMinNtz = toNtz(minPowerUpBabz);

    return (
      <PowerUpComponent
        {...{
          minPowerUpBabz: this.controller.minimumPowerUpSizeBabz(),
          pwrBalance: this.power.balanceOf(account.proxy),
          nutzBalance: babzBalance && babzBalance.div(NTZ_DECIMALS),
          totalSupplyPwr: this.power.totalSupply(),
          completeSupplyBabz: this.controller.completeSupply(),
          activeSupplyPwr: this.power.activeSupply(),
          activeSupplyBabz: this.token.activeSupply(),
          messages,
          handlePowerUp: this.handlePowerUp,
          estimatePowerUp: this.estimatePowerUp,
          account,
          calcNTZtoABP,
          powerUpRate,
          powerUpMaxBabz,
          powerUpMinNtz,
          totalAvailPwr,
        }}
      />
    );
  }
}
PowerUp.propTypes = {
  account: PropTypes.object,
  modalDismiss: PropTypes.func.isRequired,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  activeTab: getActiveTab(),
  account: makeSelectAccountData(),
  blocky: makeBlockySelector(),
  dashboardTxs: createDashboardTxsSelector(),
  nickName: makeNickNameSelector(),
  signerAddr: makeSignerAddrSelector(),
  privKey: makeSelectPrivKey(),
  amountUnit: getAmountUnit(),
  investType: getInvestType(),
  investTour: getInvestTour(),
});

export default web3Connect(
  mapStateToProps,
  () => ({
    setAmountUnit,
    notifyCreate,
    modalDismiss,
  }),
)(PowerUp);
