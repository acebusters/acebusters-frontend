import { fromJS } from 'immutable';

import reducer from '../reducer';
import {
  toggleActionBarVisible,
} from '../actions';

describe('setActionBarActive', () => {
  it('should set "active" value', () => {
    const before = fromJS({
      visible: false,
    });
    const nextState = reducer(before, toggleActionBarVisible(true));
    expect(nextState.get('visible')).toEqual(true);
  });
});

describe('toggleActionBarVisible', () => {
  it('should toggle "visible" value', () => {
    const before = fromJS({
      visible: false,
    });
    const nextState = reducer(before, toggleActionBarVisible());
    expect(nextState.get('visible')).toEqual(true);
  });
});
