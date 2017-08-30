import React from 'react';
import { LOCATION_CHANGE } from 'react-router-redux';
import { put, takeEvery, take, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import * as storageService from '../../services/sessionStorage';

import WithLoading from '../../components/WithLoading';

import {
  formatNtz,
  formatEth,
} from '../../utils/amountFormatter';

import {
  NOTIFY_CREATE,
  NOTIFY_REMOVE,
  notifyAdd,
  notifyDelete,
  notifyRemoving,
} from './actions';

import {
  SET_AUTH,
  ACCOUNT_LOADED,
  INJECT_ACCOUNT_UPDATE,
  PROXY_EVENTS,
  CONTRACT_TX_SEND,
  CONTRACT_TX_SUCCESS,
  CONTRACT_TX_ERROR,
  CONTRACT_EVENTS,
} from '../AccountProvider/actions';
import { getWeb3 } from '../AccountProvider/utils';
import { POWERUP } from '../Dashboard/actions';
import { makeLatestHandSelector } from '../Table/selectors';

import {
  TRANSFER_ETH,
  TRANSFER_NTZ,
  SELL_NTZ,
  PURCHASE_NTZ,
  ETH_PAYOUT,
  loggedInSuccess,
  noWeb3Danger,
  firstLogin,
  notLoggedIn,
  transferPending,
  transferSuccess,
  exchangePending,
  exchangeSuccess,
  ethPayoutPending,
  ethPayoutSuccess,
} from './constants';

import { waitForTx } from '../../utils/waitForTx';
import { conf } from '../../app.config';

function* createTempNotification(note) {
  yield put(notifyAdd(note));
  // TODO don't call removeNotification if NOTIFY_REMOVE is already dispatched
  // wait for NOTIFY_REMOVE to be dispatched by the user
  // or call NOTIFY_REMOVE after timeout
  yield delay(3000);
  yield* removeNotification({ txId: note.txId });
}

function* createPersistNotification(note) {
  yield put(notifyAdd(note));
}

function* createNotification(action) {
  if (action.notifyType === TRANSFER_ETH) {
    yield* transferPendingEth();
  }
  if (action.notifyType === ETH_PAYOUT) {
    yield* transferPendingEthPayout();
  }
  if (action.notifyType === TRANSFER_NTZ) {
    yield* transferPendingNtz();
  }
  if (action.notifyType === SELL_NTZ) {
    const pendMethod = 'sell';
    const successEvent = 'Sell';
    const details = 'NTZ for ETH';
    yield* exchangeSellPending(pendMethod, successEvent, details);
  }
  if (action.notifyType === PURCHASE_NTZ) {
    yield* exchangePurPending();
  }
  if (action.notifyType === POWERUP) {
    const pendMethod = 'transfer';
    const successEvent = 'Transfer';
    const details = 'NTZ for ABP';
    yield* exchangeSellPending(pendMethod, successEvent, details);
  }
  // throw error?
}

function* removeNotification({ txId }) {
  // trigger remove note animation
  yield put(notifyRemoving(txId));
  // remove element after animation finishes
  yield delay(400);
  yield put(notifyDelete(txId));
}

function* authNotification({ newAuthState }) {
  const { loggedIn } = newAuthState;
  if (loggedIn) {
    yield* removeNotification({ txId: notLoggedIn.txId });
    yield* removeNotification({ txId: firstLogin.txId });
    yield* createTempNotification(loggedInSuccess);
  }
}

function* injectedWeb3Notification({ payload: { isLocked } }) {
  if (!isLocked) {
    yield call(delay, 2000);
    const state = yield select();
    const injected = yield call([state, state.getIn], ['account', 'injected']);
    if (!injected) {
      yield* createPersistNotification(noWeb3Danger);
    }
  }
}

function* injectedWeb3NotificationDismiss({ payload: injected }) {
  if (typeof injected === 'string') {
    yield put(notifyDelete(noWeb3Danger.txId));
  }
}

function getIsRebuy(tableAddr, handId) {
  return !!storageService.getItem(`rebuyModal[${tableAddr}${handId}]`);
}

function* tableNotifications(sendAction) {
  const state = yield select();
  const table = yield call([state, state.get], 'table');
  const isLocked = yield call([state, state.getIn], ['account', 'isLocked']);
  const tableAddr = sendAction.payload.args[0];

  if (table.has(tableAddr) && sendAction.payload.methodName === 'transData') {
    const handId = yield call(makeLatestHandSelector(), state, { params: { tableAddr } });
    const isRebuy = yield call(getIsRebuy, tableAddr, handId);

    const pendingNotification = {
      txId: tableAddr,
      category: isRebuy ? 'Rebuy' : 'Table joining',
      details: <span><WithLoading isLoading loadingSize="14px" type="inline" /> {tableAddr.substring(2, 8)}</span>,
      dismissable: true,
      date: new Date(),
      type: 'info',
    };

    if (isLocked) { // do not need to show notification for shark account here
      yield* createPersistNotification(pendingNotification);
    }

    while (true) { // eslint-disable-line no-constant-condition
      const finalAction = yield take([CONTRACT_TX_ERROR, CONTRACT_TX_SUCCESS]);
      try {
        if (tableAddr === finalAction.payload.args[0]) {
          if (finalAction.type === CONTRACT_TX_SUCCESS) {
            if (!isLocked) { // show notification for sharks (after submitting tx in metamask)
              yield* createPersistNotification(pendingNotification);
            }

            const web3 = yield call(getWeb3);
            yield call(waitForTx, web3, finalAction.payload.txHash);
            yield* removeNotification({ txId: tableAddr });
            yield* createTempNotification({
              txId: tableAddr,
              category: isRebuy ? 'Successful Rebuy' : 'Table Joined',
              details: 'Good luck!',
              dismissable: true,
              date: new Date(),
              type: 'success',
            });
          } else {
            throw finalAction;
          }
        }
      } catch (errorAction) {
        const { payload: { error } } = errorAction;
        yield* removeNotification({ txId: tableAddr });

        const errorNotification = {
          txId: tableAddr,
          dismissable: true,
          date: new Date(),
          type: 'danger',
          category: isRebuy ? 'Rebuy' : 'Table joining',
          details: 'Something goes wrong, try again',
        };

        if (typeof error === 'string' && error.indexOf('MetaMask Tx Signature: User denied') > -1) {
          yield* createTempNotification({
            ...errorNotification,
            category: 'Denied by user',
            details: '',
          });
        } else {
          yield* createTempNotification(errorNotification);
        }
      }
    }
  }
}

function* visitorModeNotification({ payload: { pathname = '' } }) {
  const state = yield select();
  const loggedIn = yield call([state, state.getIn], ['account', 'loggedIn']);
  if (!loggedIn) {
    const isNotificationVisible = !pathname.match(/register|login/);
    if (isNotificationVisible) {
      yield* createPersistNotification(notLoggedIn);
    } else {
      yield* removeNotification({ txId: notLoggedIn.txId });
    }
  }
}

function* exchangeSellPending(pendMethod, successEvent, details) {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: { methodName, txHash } } = yield take(CONTRACT_TX_SUCCESS);
    if (methodName === pendMethod) {
      yield* createPersistNotification({
        ...exchangePending,
        txId: txHash,
        details,
      });
      yield* exchangeSellSuccess(successEvent, details);
      break;
    }
  }
}

function* exchangeSellSuccess(successEvent, details) {
  // remove pending and create success notification
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(CONTRACT_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === successEvent) {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification({ ...exchangeSuccess, details });
      break;
    }
  }
}

function* transferPendingNtz() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: { args, txHash, methodName } } = yield take(CONTRACT_TX_SUCCESS);
    if (methodName === 'transfer') {
      yield* createPersistNotification({
        ...transferPending,
        txId: txHash,
        details: `Sending ${formatNtz(args[1])} NTZ`,
      });
      yield* transferSuccessNtz();
      break;
    }
  }
}

function* transferSuccessNtz() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(CONTRACT_EVENTS);
    const { args, transactionHash, event } = payload[0];
    if (event === 'Transfer') {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification({
        ...transferSuccess,
        details: `Sent ${formatNtz(args.value)} NTZ`,
      });
      break;
    }
  }
}

function* exchangePurPending() {
  const { payload: { txHash, methodName } } = yield take(CONTRACT_TX_SUCCESS);
  if (methodName === 'purchase') {
    yield* createPersistNotification({
      ...exchangePending,
      txId: txHash,
      details: 'ETH for NTZ',
    });
    yield* exchangePurSuccess();
  }
}

function* exchangePurSuccess() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(PROXY_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === 'Withdrawal') {
      yield* removeNotification({ txId: transactionHash });

      yield* createTempNotification({
        ...exchangeSuccess,
        details: 'ETH for NTZ',
      });
      break;
    }
  }
}

function* transferPendingEthPayout() {
  const { payload: { txHash, methodName, address } } = yield take(CONTRACT_TX_SUCCESS);
  if (methodName === 'withdraw' && address === conf().pullAddr) {
    yield* createPersistNotification({
      ...ethPayoutPending,
      txId: txHash,
    });
    yield* transferSuccessEthPayout();
  }
}

function* transferSuccessEthPayout() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(PROXY_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === 'Deposit') {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification(ethPayoutSuccess);
      break;
    }
  }
}

function* transferPendingEth() {
  const { payload: { txHash, args, methodName } } = yield take(CONTRACT_TX_SUCCESS);
  if (methodName === 'forward' && args[2] === '') { // transfer eth
    yield* createPersistNotification({
      ...transferPending,
      txId: txHash,
      details: `Sending ${formatEth(args[1])} ETH`,
    });
    yield* transferSuccessEth();
  }
}

function* transferSuccessEth() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(PROXY_EVENTS);
    const { args, transactionHash, event } = payload[0];
    if (event === 'Withdrawal') {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification({
        ...transferSuccess,
        details: `Sent ${formatEth(args.value)} ETH`,
      });
      break;
    }
  }
}

export function* notificationsSaga() {
  yield takeEvery(LOCATION_CHANGE, visitorModeNotification);
  yield takeEvery(SET_AUTH, authNotification);
  yield takeEvery(ACCOUNT_LOADED, injectedWeb3Notification);
  yield takeEvery(INJECT_ACCOUNT_UPDATE, injectedWeb3NotificationDismiss);
  yield takeEvery(NOTIFY_CREATE, createNotification);
  yield takeEvery(NOTIFY_REMOVE, removeNotification);
  yield takeEvery(CONTRACT_TX_SEND, tableNotifications);

  yield call(visitorModeNotification, {
    payload: {
      pathname: window.location.pathname,
    },
  });
}

export default [
  notificationsSaga,
];
