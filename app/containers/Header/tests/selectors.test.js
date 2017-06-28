import { fromJS } from 'immutable';
import {
  getHeaderCollapsed,
} from '../selectors';

describe('Header Selectors', () => {
  it('should getHeaderCollapsed state', () => {
    const mockedState = fromJS({
      header: { collapsed: true },
    });
    const selector = getHeaderCollapsed();
    expect(selector(mockedState)).toEqual(true);
    expect(selector(mockedState)).not.toEqual(false);
  });
});
