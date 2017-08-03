/**
 * Created by helge on 31.03.17.
 */
/**
 * Testing our Button component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Table from '../index';
import { Winner } from '../styles';


// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';

describe('ActionBar', () => {
  it('should render winners', () => {
    const props = {
      state: 'showdoen',
      params: {
        tableAddr: '0x123',
      },
      lineup: [{
        address: P1_ADDR,
        cards: [1, 2],
      }],
      me: {},
      sb: 1,
      winners: [
        "Helge won with a pair of A's",
      ],
    };
    const table = shallow(
      <Table {...props} />
    );
    expect(table.find(Winner).length).toBeGreaterThan(0);
  });
});
