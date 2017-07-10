import { fromJS } from 'immutable';

import reducer from '../reducer';
import {
  setActionBarTurnComplete,
  setActionBarButtonActive,
  updateActionBar,
  CALL,
} from '../actions';

describe('setActionBarTurnComplete', () => {
  it('should set "active" value', () => {
    const before = fromJS({
      turnComplete: false,
    });
    const nextState = reducer(before, setActionBarTurnComplete(true));
    expect(nextState.get('turnComplete')).toEqual(true);
  });
});

describe('setActionBarButtonActive', () => {
  it('should set "sliderOpen" value', () => {
    const before = fromJS({
      sliderOpen: false,
    });
    const nextState = reducer(before, setActionBarButtonActive('CALL'));
    expect(nextState.get('buttonActive')).toEqual('CALL');
  });
});

describe('update', () => {
  it('shuold merge payload to state', () => {
    const before = fromJS({
      buttonActive: '', // used for activeIndicator
      sliderOpen: false, // toggles slider open/closed
      turnComplete: false,
      mode: '', // tracks active button's life-cycle
      executeAction: false,
    });
    const nextState = reducer(before, updateActionBar({
      mode: CALL,
      executeAction: true,
    }));
    expect(nextState.get('mode')).toEqual(CALL);
  });
});
