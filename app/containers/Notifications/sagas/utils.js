import React from 'react';
import { FormattedMessage } from 'react-intl';
import { delay } from 'redux-saga';
import { put, take, race } from 'redux-saga/effects';

import { CONTRACT_TX_SENDED, CONTRACT_TX_MINED, CONTRACT_TX_FAILED, CONTRACT_TX_NOT_EXISTS } from '../../AccountProvider/actions';
import { POWERUP, POWERDOWN } from '../../Dashboard/constants';
import { conf } from '../../../app.config';

import { notifyAdd, notifyDelete, notifyRemoving } from '../actions';
import {
  TRANSFER_ETH,
  TRANSFER_NTZ,
  SELL_NTZ,
  PURCHASE_NTZ,
  ETH_PAYOUT,
  InfoIcon,
  txPending,
  txSuccess,
} from '../constants';
import msgs from '../messages';

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

function matchMethod(methodName, address) {
  return ({ payload }) => {
    if (address) {
      return payload.methodName === methodName && payload.address === address;
    }

    return payload.methodName === methodName;
  };
}

export function* createNotification({ notifyProps: { amount }, notifyType }) {
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
    yield* createTransactionNotifications(matchMethod('forward'), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('transfer'), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('withdraw', conf().pullAddr), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('sell'), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('powerUp'), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('transfer'), pendingMsg, successMsg);
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
    yield* createTransactionNotifications(matchMethod('purchase'), pendingMsg, successMsg);
  }
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
