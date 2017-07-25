import { select, put, take, call } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { addEventsDate, isUserEvent } from '../utils';
import { contractEvents } from '../actions';

const ethEvent = (contract) => eventChannel((emitter) => {
  const events = contract.allEvents({ fromBlock: 'latest' });
  events.watch((error, results) => {
    if (error) {
      emitter(END);
      events.stopWatching();
      return;
    }
    emitter(results);
  });
  return () => {
    events.stopWatching();
  };
});

export function* ethEventListenerSaga(contract) {
  const chan = yield call(ethEvent, contract);
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const event = yield take(chan);
      const state = yield select();
      const proxy = state.getIn(['account', 'proxy']);
      if (isUserEvent(proxy)(event)) {
        const events = yield call(addEventsDate, [event]);
        yield put(contractEvents(events, proxy));
      }
    } catch (e) {} // eslint-disable-line no-empty
  }
}
