import { fromJS } from 'immutable';
import reducer from '../reducer';
import {
  setCollapsed,
} from '../actions';

describe('header reducer', () => {
  describe('setCollapsed', () => {
    it('should set collapsed depending on value', () => {
      const before = fromJS({
        collapsed: false,
      });
      const nextState = reducer(before, setCollapsed(true));
      expect(nextState.get('collapsed')).toEqual(true);
    });
  });
});
