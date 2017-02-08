/**
 * Created by helge on 20.01.17.
 */

import React from 'react';
import EWT from 'ethereum-web-token';
import { shallow } from 'enzyme';
import { Table } from '../index';

const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_FOLD = [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_SIT_OUT = [{ name: 'sitOut', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

// secretSeed: 'rural tent test net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

// secretSeed: 'stadium today then top toward crack faint similar mosquito hunt thing sibling'
const P3_ADDR = '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc';

// secretSeed: 'pony section spike blossom club amused keep will gorilla assist busy tray'
const P4_KEY = '0xa803ed744543e69b5e4816c5fc7539427a2928e78d729c87712f180fae52fcc9';


describe('components', () => {
  describe('Table', () => {
    it('should render self', () => {
      const lineup = [{
        address: P1_ADDR,
        last: new EWT(ABI_FOLD).fold(1, 50).sign(P1_KEY),

      }, {
        address: P2_ADDR,
        last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
      }, {
        address: P3_ADDR,
        last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
      }, {
        address: P3_ADDR,
        last: new EWT(ABI_SIT_OUT).sitOut(1, 0).sign(P4_KEY),
      }];

      const props = {
        privKey: P1_KEY,
        params: {
          addr: '',
        },
        location: {
          query: {
            privKey: P1_KEY,
          },
        },
        hand: {
          lineup,
          dealer: 0,
          state: 'flop',
          cards: [1, 2],
        },
      };

      const wrapper = shallow(<Table {...props} />);
      expect(wrapper.find('#root').length).toBe(1);
    });
  });
});
