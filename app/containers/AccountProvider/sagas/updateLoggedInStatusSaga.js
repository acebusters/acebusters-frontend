import Raven from 'raven-js';
import * as storageService from '../../../services/localStorage';

export function* updateLoggedInStatusSaga(action) { // SET_AUTH action
  if (!action.newAuthState.loggedIn) {
    storageService.removeItem('privKey');
    storageService.removeItem('email');
    storageService.removeItem('accountId');
  } else {
    Raven.setUserContext({
      email: action.newAuthState.email,
    });
    storageService.setItem('privKey', action.newAuthState.privKey);
    storageService.setItem('email', action.newAuthState.email);
    storageService.setItem('accountId', action.newAuthState.accountId);
  }
}
