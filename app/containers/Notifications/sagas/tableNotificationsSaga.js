import React from 'react';
import { take, select, call, race } from 'redux-saga/effects';

import { CONTRACT_TX_SENDED, CONTRACT_TX_ERROR, CONTRACT_TX_MINED, CONTRACT_TX_FAILED, CONTRACT_TX_NOT_EXISTS } from '../../AccountProvider/actions';
import { makeLatestHandSelector } from '../../Table/selectors';
import * as storageService from '../../../services/sessionStorage';
import WithLoading from '../../../components/WithLoading';

import { createTempNotification, createPersistNotification, removeNotification } from './utils';

import { tableNameByAddress } from '../../../services/tableNames';

function getIsRebuy(tableAddr, handId) {
  return !!storageService.getItem(`rebuyModal[${tableAddr}${handId}]`);
}

export function* tableNotifications(sendAction) {
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
      details: (
        <span>
          <WithLoading isLoading loadingSize="14px" type="inline" /> {tableNameByAddress(tableAddr)}
        </span>
      ),
      dismissable: true,
      date: new Date(),
      type: 'info',
    };

    if (isLocked) { // do not need to show notification for shark account here
      yield* createPersistNotification(pendingNotification);
    }

    while (true) { // eslint-disable-line no-constant-condition
      const finalAction = yield take([CONTRACT_TX_ERROR, CONTRACT_TX_SENDED]);
      try {
        if (tableAddr === finalAction.payload.args[0]) {
          if (finalAction.type === CONTRACT_TX_SENDED) {
            if (!isLocked) { // show notification for sharks (after submitting tx in metamask)
              yield* createPersistNotification(pendingNotification);
            }

            const { success, notExists, fail } = yield race({
              success: take((action) => action.type === CONTRACT_TX_MINED && action.meta.txHash === finalAction.payload.txHash),
              notExists: take((action) => action.type === CONTRACT_TX_NOT_EXISTS && action.meta.txHash === finalAction.payload.txHash),
              fail: take((action) => action.type === CONTRACT_TX_FAILED && action.meta.txHash === finalAction.payload.txHash),
            });
            yield* removeNotification({ txId: tableAddr });

            if (success) {
              yield* createTempNotification({
                txId: tableAddr,
                category: isRebuy ? 'Successful Rebuy' : 'Table Joined',
                details: 'Good luck!',
                dismissable: true,
                date: new Date(),
                type: 'success',
              });
            } else if (notExists) {
              yield* createTempNotification({
                txId: tableAddr,
                category: 'Error',
                details: 'Something wrong with transaction, check metamask',
                dismissable: true,
                date: new Date(),
                type: 'danger',
              });
            } else if (fail) {
              yield* createTempNotification({
                txId: tableAddr,
                category: 'Transaction failed',
                details: 'Maybe the seat is already busy',
                dismissable: true,
                date: new Date(),
                type: 'danger',
              });
            }
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
