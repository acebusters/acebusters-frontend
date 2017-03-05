import {
  TRANSFER_TOGGLE,
  transferToggle,
} from '../actions';

describe('App Actions', () => {
  describe('transferToggle', () => {
    it('should return the correct type', () => {
      const expectedResult = {
        type: TRANSFER_TOGGLE,
      };

      expect(transferToggle()).toEqual(expectedResult);
    });
  });
});
