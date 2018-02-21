import React from 'react';
import { delay } from 'redux-saga';
import { put, take, race } from 'redux-saga/effects';

import { CONTRACT_TX_SENDED, CONTRACT_TX_MINED, CONTRACT_TX_FAILED, CONTRACT_TX_NOT_EXISTS } from '../../AccountProvider/actions';

import { notifyAdd, notifyDelete, notifyRemoving } from '../actions';
import { InfoIcon } from '../constants';

export function* createTempNotification(note) {
  yield put(notifyAdd(note));
  // TODO don't call removeNotification if NOTIFY_REMOVE is already dispatched
  // wait for NOTIFY_REMOVE to be dispatched by the user
  // or call NOTIFY_REMOVE after timeout
  yield delay(3000);
  yield* removeNotification({ txId: note.txId });
}

export function* createPersistNotification(note) {
  yield put(notifyAdd(note));
}

export function* removeNotification({ txId }) {
  // trigger remove note animation
  yield put(notifyRemoving(txId));
  // remove element after animation finishes
  yield delay(400);
  yield put(notifyDelete(txId));
}

export function* createTransactionNotifications(isNeededTx, pendingNotification, successNotification) {
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take((a) => a.type === CONTRACT_TX_SENDED && isNeededTx(a));
    const { payload: { txHash } } = action;
    yield* createPersistNotification({
      ...pendingNotification,
      txId: txHash,
      infoIcon: <InfoIcon transactionHash={txHash} />,
    });

    const { success, notExists, fail } = yield race({
      success: take((a) => a.type === CONTRACT_TX_MINED && a.meta.txHash === txHash),
      notExists: take((a) => a.type === CONTRACT_TX_NOT_EXISTS && a.meta.txHash === txHash),
      fail: take((a) => a.type === CONTRACT_TX_FAILED && a.meta.txHash === txHash),
    });
    yield* removeNotification({ txId: txHash });

    if (success && successNotification) {
      yield* createTempNotification(successNotification);
    } else if (fail) {
      yield* createTempNotification({
        txId: txHash,
        category: 'Error',
        details: 'Transaction failed',
        dismissable: true,
        date: new Date(),
        type: 'danger',
      });
    } else if (notExists) {
      yield* createTempNotification({
        txId: txHash,
        category: 'Error',
        details: 'Something wrong with transaction, check metamask',
        dismissable: true,
        date: new Date(),
        type: 'danger',
      });
    }
  }
}
