import { fromJS } from 'immutable';

import reducer from '../reducer';
import {
  setActionBarTurnComplete,
  setActionBarMode,
  setActionBarBetSlider,
  setActionBarButtonActive,
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

describe('setActionBarMode', () => {
  it('should toggle "visible" value', () => {
    const before = fromJS({
      mode: '',
    });
    const nextState0 = reducer(before, setActionBarMode('CALL'));
    expect(nextState0.get('mode')).toEqual('CALL');
    const nextState1 = reducer(before, setActionBarMode(null));
    expect(nextState1.get('mode')).toEqual('');
  });
});

describe('setActionBarBetSlider', () => {
  it('should set "sliderOpen" value', () => {
    const before = fromJS({
      sliderOpen: false,
    });
    const nextState = reducer(before, setActionBarBetSlider(true));
    expect(nextState.get('sliderOpen')).toEqual(true);
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
