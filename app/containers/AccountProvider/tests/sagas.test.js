import { put } from 'redux-saga/effects';

import { logout } from '../sagas';
import { setAuthState } from '../actions';

describe('githubDataSaga Saga', () => {
  const logoutSaga = logout();
  // const mockedTask = createMockTask();
  it('should start task to watch for SENDING_REQUEST action', () => {
    const takeLatestDescriptor = logoutSaga.next().value;
    expect(takeLatestDescriptor).toEqual(put(setAuthState(false)));
  });
});
