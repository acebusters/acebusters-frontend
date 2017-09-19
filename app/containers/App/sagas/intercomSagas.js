import { select, takeEvery, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { conf } from '../../../app.config';

import { SET_AUTH, ACCOUNT_LOADED } from '../../AccountProvider/actions';
import { makeSelectAccountData } from '../../AccountProvider/selectors';
import { getRefs } from '../../../services/account';

function formatRefs(refs) {
  return refs.map((ref) => `${ref.id} (${ref.allowance}`).join(', ');
}

export function* updateIntercomUser(action) {
  const account = yield select(makeSelectAccountData());
  if (window.Intercom && account.loggedIn) {
    const refs = yield call(getRefs, account.accountId);
    window.Intercom('update', {
      email: account.email,
      user_id: action.payload.signer,
      proxy: action.payload.proxy,
      fish: action.payload.isLocked,
      nickname: action.payload.nickName,
      promo_code: refs.length === 1 ? refs[0].id : undefined,
      refs: refs.length === 1 ? undefined : formatRefs(refs),
    });
  }
}

export function* updateIntercomOnLocationChange() {
  if (window.Intercom) {
    window.Intercom('update');
  }
}

export function* restartIntercomOnLogout(action) {
  if (!window.Intercom) {
    return;
  }

  if (!action.newAuthState.loggedIn) {
    window.Intercom('shutdown');
    window.Intercom('boot');
  }
}

export default function* intercomSaga() {
  if (window.Intercom) {
    window.intercomSettings = {
      app_id: conf().intercomAppId,
    };
    window.Intercom('boot');
  }

  yield takeEvery(SET_AUTH, restartIntercomOnLogout);
  yield takeEvery(LOCATION_CHANGE, updateIntercomOnLocationChange);
  yield takeEvery(ACCOUNT_LOADED, updateIntercomUser);
}
