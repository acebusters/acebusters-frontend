import React from 'react';
import { shallow } from 'enzyme';
import RebuyDialog from 'components/RebuyDialog';
import JoinDialog from '../index';

describe('Join Dialog', () => {
  it('should render rebuy dialog when balance is insufficient', () => {
    const props = {
      balance: 20,
      tableStakes: { sb: 1, min: 40, tableMax: 200 },
    };
    const el = shallow(<JoinDialog {...props} />);
    expect(el.find(RebuyDialog).length).toBe(1);
  });
});
