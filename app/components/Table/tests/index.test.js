import React from 'react';
import { shallow } from 'enzyme';
import Table from 'components/Table';
import { Winner } from '../styles';

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P2_ADDR = '0xA7Ba18a03393E8Aa141c69B3619b35676bd5a72d';

describe('ActionBar', () => {
  it('should render winners', () => {
    const props = {
      state: 'showdown',
      isTaken: () => {},
      board: [], // showdown should require to show all cards?
      params: { tableAddr: '0x123' },
      seats: [
        { address: P1_ADDR, cards: [1, 2] },
        { address: P2_ADDR, cards: [-1, -1] },
      ],
      lineup: [{
        address: P1_ADDR,
        cards: [1, 2],
      }],
      me: {},
      sb: 1,
      winners: [
        {
          addr: '0x00',
          amount: 0,
          maxBet: 0,
        },
      ],
    };
    const table = shallow(<Table {...props} />);
    expect(table.find(Winner).length).toBeGreaterThan(0);
  });
});
