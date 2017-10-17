import React from 'react';
import { FormattedMessage } from 'react-intl';
import { take, put } from 'redux-saga/effects';

import { CONFIRM_DIALOG } from '../../Modal/constants';
import { CONTRACT_TX_ERROR } from '../../AccountProvider/actions';
import { modalAdd, modalDismiss } from '../../App/actions';
import messages from '../messages';

export function* errorModalSaga(dispatch) {
  while (true) { // eslint-disable-line
    const { payload } = yield take(CONTRACT_TX_ERROR);

    yield put(modalAdd({
      modalType: CONFIRM_DIALOG,
      modalProps: {
        title: <FormattedMessage {...messages.transactionErrorTitle} />,
        msg: formatTxErrorMessage(payload.error),
        onSubmit: () => dispatch(modalDismiss()),
        buttonText: <FormattedMessage {...messages.ok} />,
      },
    }));
  }
}

function formatTxErrorMessage(error) {
  if (typeof error === 'string' && error.indexOf('MetaMask Tx Signature') > -1) {
    return 'Transaction denied';
  }

  return error;
}
