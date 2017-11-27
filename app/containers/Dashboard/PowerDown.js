import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import { modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import {
  NTZ_DECIMALS,
  ABP_DECIMALS,
  toNtz,
} from '../../utils/amountFormatter';
import { notifyCreate } from '../Notifications/actions';

import makeSelectAccountData, {
  makeSignerAddrSelector,
  makeSelectPrivKey,
  makeBlockySelector,
  makeNickNameSelector,
} from '../AccountProvider/selectors';
import { POWERDOWN, setAmountUnit } from './actions';
import messages from './messages';
import {
  getActiveTab,
  getAmountUnit,
  getInvestType,
  getInvestTour,
  createDashboardTxsSelector,
} from './selectors';

import PowerDownComponent from '../../components/Dashboard/PowerDown';

import {
  ABI_CONTROLLER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  conf,
} from '../../app.config';

const confParams = conf();

class PowerDown extends React.Component {
  constructor(props) {
    super(props);

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
    const { account } = this.props;
    const babzBalance = this.token.balanceOf(account.proxy);
    const completeSupplyBabz = this.controller.completeSupply();
    const activeSupplyPwr = this.power.activeSupply();
    const minPowerUpBabz = this.controller.minimumPowerUpSizeBabz();

    if (!completeSupplyBabz || !activeSupplyPwr || !minPowerUpBabz) {
      return null;
    }

    const totalSupplyPwr = this.power.totalSupply();
    const adjTotalSupplyPwr = totalSupplyPwr.mul(2);
    const calcABPtoNTZ = (amount) => {
      const abpAmount = new BigNumber(amount);
      return abpAmount.div(adjTotalSupplyPwr).mul(completeSupplyBabz);
    };
    const calcNTZtoABP = (amount) => {
      const ntzAmount = new BigNumber(amount);
      return adjTotalSupplyPwr.mul(ntzAmount.div(completeSupplyBabz));
    };
    const totalAvailPwr = totalSupplyPwr.sub(activeSupplyPwr);
    const powerDownMinAbp = calcNTZtoABP(toNtz(minPowerUpBabz));

    return (
      <PowerDownComponent
        {...{
          minPowerUpBabz: this.controller.minimumPowerUpSizeBabz(),
          pwrBalance: this.power.balanceOf(account.proxy),
          nutzBalance: babzBalance && babzBalance.div(NTZ_DECIMALS),
          totalSupplyPwr: this.power.totalSupply(),
          completeSupplyBabz: this.controller.completeSupply(),
          activeSupplyPwr: this.power.activeSupply(),
          activeSupplyBabz: this.token.activeSupply(),
          messages,
          handlePowerDown: this.handlePowerDown,
          estimatePowerDown: this.estimatePowerDown,
          account,
          calcABPtoNTZ,
          powerDownMinAbp,
          totalAvailPwr,
        }}
      />
    );
  }
}
PowerDown.propTypes = {
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
)(PowerDown);
