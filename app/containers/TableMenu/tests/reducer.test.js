import { fromJS } from 'immutable';
//
import reducer from '../reducer';
import {
  toggleMenuActive,
  toggleMenuOpen,
} from '../actions';

describe('containers.TableMenu.reducer', () => {
  describe('toggleMenuActive', () => {
    it('should toggle active value', () => {
      const before = fromJS({
        active: false,
      });
      const nextState = reducer(before, toggleMenuActive());
      expect(nextState.get('active')).toEqual(true);
    });
  });

  describe('toggleMenuOpen', () => {
    it('should toggle open value', () => {
      const before = fromJS({
        open: false,
      });
      const nextState = reducer(before, toggleMenuOpen());
      expect(nextState.get('open')).toEqual(true);
    });
  });
});
