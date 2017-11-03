import { select } from 'redux-saga/effects';

import { makeSelectProxyAddr, selectAccount } from '../../AccountProvider/selectors';
import { generateNetworkApi } from '../../AccountProvider/web3Connect';
import {
  ABI_POWER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_PULL_PAYMENT_CONTRACT,
  ABI_CONTROLLER_CONTRACT,
  conf,
} from '../../../app.config';

export default function* balancesLoadingSaga(dispatch) {
  const account = yield select(selectAccount);
  const proxyAddr = yield select(makeSelectProxyAddr());

  const { web3 } = generateNetworkApi(account, dispatch);

  const token = web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
  const power = web3.eth.contract(ABI_POWER_CONTRACT).at(conf().pwrAddr);
  const controller = web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(conf().contrAddr);
  const pullPayment = web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(conf().pullAddr);

  web3.eth.getBalance(proxyAddr);
  pullPayment.paymentOf.call(proxyAddr);
  token.balanceOf.call(proxyAddr);
  power.downs.call(proxyAddr);
  power.balanceOf.call(proxyAddr);
  controller.paused.call();
}
