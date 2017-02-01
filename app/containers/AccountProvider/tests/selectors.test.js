import { fromJS } from 'immutable';
import { selectAccount } from '../selectors';

describe('selectAccount', () => {
  it('should select account', () => {
    const globalState = fromJS({ loggedIn: false });
    const mockedState = fromJS({
      account: globalState,
    });
    expect(selectAccount(mockedState)).toEqual(globalState);
  });
});
