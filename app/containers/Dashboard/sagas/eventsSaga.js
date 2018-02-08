import { select, take, put, fork } from 'redux-saga/effects';

import { makeSignerAddrSelector, selectAccount } from '../../AccountProvider/selectors';
import { ethEvent } from '../../AccountProvider/sagas/ethEventListenerSaga';
import { addEventsDate, isUserEvent } from '../../AccountProvider/utils';
import { generateNetworkApi } from '../../AccountProvider/web3Connect';
import { contractEvents } from '../../AccountProvider/actions';
import { ABI_TOKEN_CONTRACT, conf } from '../../../app.config';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

const LOOK_BEHIND_PERIOD = 4 * 60 * 24;

function* initEvents(contract, fromBlock, signerAddr, action) {
  const allEvents = contract.allEvents({
    fromBlock,
    toBlock: 'latest',
  });
  const eventList = yield promisifyWeb3Call(allEvents.get.bind(allEvents))();
  const userEvents = yield addEventsDate(eventList.filter(isUserEvent(signerAddr)));
  yield put(action(userEvents, signerAddr));
}

function* tokenEventsSaga(token, addr) {
  const tokenChannel = ethEvent(token);
  while (true) { // eslint-disable-line
    const event = yield take(tokenChannel);

    if (!isUserEvent(addr)(event)) {
      continue; // eslint-disable-line no-continue
    }

    const events = yield addEventsDate([event]);
    yield put(contractEvents(events, addr));

    token.balanceOf.call(addr);
    token.web3.eth.getBalance(addr);
  }
}

export function* eventsSaga(dispatch) {
  const account = yield select(selectAccount);
  const signerAddr = yield select(makeSignerAddrSelector());

  const { web3 } = generateNetworkApi(account, dispatch);
  const blockNumber = yield promisifyWeb3Call(web3.eth.getBlockNumber)();

  const token = web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);

  web3.eth.getBalance(signerAddr);
  token.balanceOf.call(signerAddr);

  yield initEvents(token, blockNumber - LOOK_BEHIND_PERIOD, signerAddr, contractEvents);
  yield fork(tokenEventsSaga, token, signerAddr);
}
