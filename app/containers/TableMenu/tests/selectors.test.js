import { fromJS } from 'immutable';
import {
  makeSelectOpen,
  makeSelectActive,
} from '../selectors';

describe('containers.TableMenu.selectors', () => {
  it('should select the tableMenu active state', () => {
    const mockedState = fromJS({
      tableMenu: {
        active: true,
      },
    });
    const statusSelector = makeSelectActive();
    expect(statusSelector(mockedState)).toEqual(true);
  });
  it('should select the tableMenu open state', () => {
    const mockedState = fromJS({
      tableMenu: {
        open: true,
      },
    });
    const statusSelector = makeSelectOpen();
    expect(statusSelector(mockedState)).toEqual(true);
  });
});
