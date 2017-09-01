import React from 'react';
import { LOCATION_CHANGE } from 'react-router-redux';
import { put, takeEvery, take, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { FormattedMessage } from 'react-intl';

import * as storageService from '../../services/sessionStorage';

import WithLoading from '../../components/WithLoading';

import {
  NOTIFY_CREATE,
  NOTIFY_REMOVE,
  notifyAdd,
  notifyDelete,
  notifyRemoving,
} from './actions';
import msgs from './messages';

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
import { POWERUP, POWERDOWN } from '../Dashboard/actions';
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
  InfoIcon,
  txPending,
  txSuccess,
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

function* createNotification({ notifyProps, notifyType }) {
  const { amount } = notifyProps;
  if (notifyType === TRANSFER_ETH) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.transferPending} />,
      details: <FormattedMessage values={{ amount }} {...msgs.transferEthPend} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.transferSuccess} />,
      details: <FormattedMessage values={{ amount }} {...msgs.transferEthSuccess} />,
    };
    yield* transferPendingEth(pendingMsg);
    yield* transferSuccessEth('Withdrawal', successMsg);
  }
  if (notifyType === TRANSFER_NTZ) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.transferPending} />,
      details: <FormattedMessage values={{ amount }} {...msgs.transferNtzPend} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.transferSuccess} />,
      details: <FormattedMessage values={{ amount }} {...msgs.transferNtzSuccess} />,
    };
    yield* exchangeSellPending('transfer', pendingMsg);
    yield* exchangeSellSuccess('Transfer', successMsg);
  }
  if (notifyType === PURCHASE_NTZ) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.exchangePending} />,
      details: <FormattedMessage {...msgs.exchangeEthToNtz} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.exchangeSuccess} />,
      details: <FormattedMessage {...msgs.exchangeEthToNtz} />,
    };
    yield* exchangeSellPending('purchase', pendingMsg);
    yield* exchangePurSuccess('Withdrawal', successMsg);
  }
  if (notifyType === SELL_NTZ) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.exchangePending} />,
      details: <FormattedMessage {...msgs.exchangeNtzToEth} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.exchangeSuccess} />,
      details: <FormattedMessage {...msgs.exchangeNtzToEth} />,
    };
    yield* exchangeSellPending('sell', pendingMsg);
    yield* exchangeSellSuccess('Sell', successMsg);
  }
  if (notifyType === ETH_PAYOUT) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.payoutPending} />,
      details: <FormattedMessage values={{ amount }} {...msgs.ethPayout} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.payoutSuccess} />,
      details: <FormattedMessage values={{ amount }} {...msgs.ethPayout} />,
    };
    yield* transferPendingEthPayout('withdraw', pendingMsg);
    yield* transferSuccessEth('Deposit', successMsg);
  }
  if (notifyType === POWERUP) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.exchangePending} />,
      details: <FormattedMessage {...msgs.exchangeNtzToAbp} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.exchangeSuccess} />,
      details: <FormattedMessage {...msgs.exchangeNtzToAbp} />,
    };
    yield* exchangeSellPending('powerUp', pendingMsg);
    yield* exchangeSellSuccess('Transfer', successMsg);
  }
  if (notifyType === POWERDOWN) {
    const pendingMsg = {
      ...txPending,
      category: <FormattedMessage {...msgs.exchangePending} />,
      details: <FormattedMessage {...msgs.exchangeAbpToNtz} />,
    };
    const successMsg = {
      ...txSuccess,
      category: <FormattedMessage {...msgs.exchangeSuccess} />,
      details: <FormattedMessage {...msgs.exchangeAbpToNtz} />,
    };
    yield* exchangeSellPending('transfer', pendingMsg);
    yield* exchangeSellSuccess('Transfer', successMsg);
  }
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

function* exchangeSellPending(pendMethod, pendingMsg) {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: { methodName, txHash } } = yield take(CONTRACT_TX_SUCCESS);
    if (methodName === pendMethod) {
      yield* createPersistNotification({
        ...pendingMsg,
        txId: txHash,
        infoIcon: <InfoIcon transactionHash={txHash} />,
      });
      break;
    }
  }
}

function* exchangeSellSuccess(successEvent, successMsg) {
  // remove pending and create success notification
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(CONTRACT_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === successEvent) {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification(successMsg);
      break;
    }
  }
}

function* exchangePurSuccess(successEvent, successMsg) {
  // remove pending and create success notification
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(PROXY_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === successEvent) {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification(successMsg);
      break;
    }
  }
}

function* transferPendingEth(msg) {
  const { payload: { txHash, args, methodName } } = yield take(CONTRACT_TX_SUCCESS);
  if (methodName === 'forward' && args[2] === '') { // transfer eth
    yield* createPersistNotification({
      ...msg,
      txId: txHash,
      infoIcon: <InfoIcon transactionHash={txHash} />,
    });
  }
}

function* transferSuccessEth(method, msg) {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(PROXY_EVENTS);
    const { transactionHash, event } = payload[0];
    if (event === method) {
      yield* removeNotification({ txId: transactionHash });
      yield* createTempNotification(msg);
      break;
    }
  }
}

function* transferPendingEthPayout(method, msg) {
  const { payload: { txHash, methodName, address } } = yield take(CONTRACT_TX_SUCCESS);
  if (methodName === method && address === conf().pullAddr) {
    yield* createPersistNotification({
      ...msg,
      txId: txHash,
      infoIcon: <InfoIcon transactionHash={txHash} />,
    });
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
