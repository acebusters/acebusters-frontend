import { select, take, put, fork } from 'redux-saga/effects';

import { makeSelectProxyAddr, selectAccount } from '../../AccountProvider/selectors';
import { ethEvent } from '../../AccountProvider/sagas/ethEventListenerSaga';
import { addEventsDate, isUserEvent } from '../../AccountProvider/utils';
import { generateNetworkApi } from '../../AccountProvider/web3Connect';
import { contractEvents, proxyEvents } from '../../AccountProvider/actions';
import {
  ABI_PROXY,
  ABI_POWER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_PULL_PAYMENT_CONTRACT,
  ABI_CONTROLLER_CONTRACT,
  conf,
} from '../../../app.config';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';
import { LOOK_BEHIND_PERIOD } from '../constants';

function* initEvents(contract, fromBlock, proxyAddr, action) {
  const allEvents = contract.allEvents({
    fromBlock,
    toBlock: 'latest',
  });
  const eventList = yield promisifyWeb3Call(allEvents.get.bind(allEvents))();
  const userEvents = yield addEventsDate(eventList.filter(isUserEvent(proxyAddr)));
  yield put(action(userEvents, proxyAddr));
}

function* proxyEventsSaga(proxy, pullPayment) {
  const proxyChannel = ethEvent(proxy);
  while (true) { // eslint-disable-line
    const event = yield take(proxyChannel);
    if (event.event === 'Deposit') {
      pullPayment.paymentOf.call(proxy.address);
    }

    const events = yield addEventsDate([event]);
    yield put(proxyEvents(events, proxy.address));

    proxy.web3.eth.getBalance(proxy.address);
  }
}

function* powerEventsSaga(power, token, proxyAddr) {
  const powerChannel = ethEvent(power);
  while (true) { // eslint-disable-line
    const event = yield take(powerChannel);
    if (!isUserEvent(proxyAddr)(event)) {
      continue; // eslint-disable-line no-continue
    }

    const events = yield addEventsDate([event]);
    yield put(contractEvents(events, proxyAddr));

    power.balanceOf.call(proxyAddr);
    power.downs.call(proxyAddr);
    token.balanceOf.call(proxyAddr);
  }
}

function* tokenEventsSaga(token, power, pullPayment, proxyAddr) {
  const tokenChannel = ethEvent(token);
  while (true) { // eslint-disable-line
    const event = yield take(tokenChannel);

    if (!isUserEvent(proxyAddr)(event)) {
      continue; // eslint-disable-line no-continue
    }

    if (event.event === 'Sell') {
      pullPayment.paymentOf.call(proxyAddr);
    }

    const events = yield addEventsDate([event]);
    yield put(contractEvents(events, proxyAddr));

    power.balanceOf.call(proxyAddr);
    power.web3.eth.getBalance(proxyAddr);
    token.balanceOf.call(proxyAddr);
  }
}

export function* eventsSaga(dispatch) {
  const account = yield select(selectAccount);
  const proxyAddr = yield select(makeSelectProxyAddr());

  const { web3 } = generateNetworkApi(account, dispatch);
  const blockNumber = yield promisifyWeb3Call(web3.eth.getBlockNumber)();

  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
  const token = web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
  const power = web3.eth.contract(ABI_POWER_CONTRACT).at(conf().pwrAddr);
  const pullPayment = web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(conf().pullAddr);
  const controller = web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(conf().contrAddr);

  web3.eth.getBalance(proxyAddr);
  pullPayment.paymentOf.call(proxyAddr);
  controller.minimumPowerUpSizeBabz.call();
  controller.completeSupply.call();
  token.floor.call();
  token.ceiling.call();
  token.totalSupply.call();
  token.activeSupply.call();
  token.balanceOf.call(proxyAddr);
  power.downs.call(proxyAddr);
  power.balanceOf.call(proxyAddr);
  power.downtime.call();
  power.totalSupply.call();
  power.activeSupply.call();

  yield initEvents(token, blockNumber - LOOK_BEHIND_PERIOD, proxyAddr, contractEvents);
  yield initEvents(power, blockNumber - LOOK_BEHIND_PERIOD, proxyAddr, contractEvents);
  yield initEvents(proxy, blockNumber - LOOK_BEHIND_PERIOD, proxyAddr, proxyEvents);

  yield fork(proxyEventsSaga, proxy, pullPayment);
  yield fork(tokenEventsSaga, token, power, pullPayment, proxyAddr);
  yield fork(powerEventsSaga, power, token, proxyAddr);
}
