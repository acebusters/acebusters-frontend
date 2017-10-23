import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import { modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import {
  NTZ_DECIMALS,
  ABP_DECIMALS,
} from '../../utils/amountFormatter';
import { notifyCreate } from '../Notifications/actions';

import makeSelectAccountData, {
  makeSignerAddrSelector,
  makeSelectPrivKey,
  makeBlockySelector,
  makeNickNameSelector,
} from '../AccountProvider/selectors';
import {
  POWERUP,
  POWERDOWN,
  setActiveTab,
  setAmountUnit,
  setInvestType,
} from './actions';
import messages from './messages';
import {
  getActiveTab,
  getAmountUnit,
  getInvestType,
  getInvestTour,
  createDashboardTxsSelector,
} from './selectors';

import InvestComponent from '../../components/Dashboard/Invest';

import {
  ABI_CONTROLLER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  conf,
} from '../../app.config';

const confParams = conf();

class Invest extends React.Component {
  constructor(props) {
    super(props);

    this.handlePowerUp = this.handlePowerUp.bind(this);
    this.estimatePowerUp = this.estimatePowerUp.bind(this);
    this.handlePowerDown = this.handlePowerDown.bind(this);
    this.estimatePowerDown = this.estimatePowerDown.bind(this);

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

  handlePowerDown(amount) {
    this.props.notifyCreate(POWERDOWN, { amount });
    return this.handleTxSubmit((callback) => {
      this.power.transfer.sendTransaction(
        0,
        new BigNumber(amount).mul(ABP_DECIMALS),
        callback
      );
    });
  }

  estimatePowerDown(amount) {
    return this.power.transfer.estimateGas(
      0,
      new BigNumber(amount).mul(ABP_DECIMALS),
    );
  }

  render() {
    const { account, investType } = this.props;
    const babzBalance = this.token.balanceOf(account.proxy);

    return (
      <InvestComponent
        {...{
          account,
          setInvestType: this.props.setInvestType,
          minPowerUpBabz: this.controller.minimumPowerUpSizeBabz(),
          pwrBalance: this.power.balanceOf(account.proxy),
          nutzBalance: babzBalance && babzBalance.div(NTZ_DECIMALS),
          totalSupplyPwr: this.power.totalSupply(),
          completeSupplyBabz: this.controller.completeSupply(),
          activeSupplyPwr: this.power.activeSupply(),
          activeSupplyBabz: this.token.activeSupply(),
          messages,
          investType,
          handlePowerUp: this.handlePowerUp,
          estimatePowerUp: this.estimatePowerUp,
          handlePowerDown: this.handlePowerDown,
          estimatePowerDown: this.estimatePowerDown,
        }}
      />
    );
  }
}
Invest.propTypes = {
  account: PropTypes.object,
  modalDismiss: PropTypes.func.isRequired,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func.isRequired,
  investType: PropTypes.oneOf([POWERUP, POWERDOWN]).isRequired,
  setInvestType: PropTypes.func.isRequired,
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
    setInvestType,
    setActiveTab,
    setAmountUnit,
    notifyCreate,
    modalDismiss,
  }),
)(Invest);
