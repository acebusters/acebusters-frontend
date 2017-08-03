/**
* Created by jzobro 20170524
*/
import React from 'react';
import { shallow } from 'enzyme';
// import sinon from 'sinon;

import Card from '../index';

describe('components.seat.CardContainer', () => {
  describe('before holeCards are dealt', () => {
    const props = { cardNumber: null, folded: false };
    const el = shallow(<Card {...props} />);
    it('should return null', () => {
      expect(el.type()).toEqual(null);
    });
  });

  describe('after holeCards are dealt', () => {
    // const props = { cardNumber: -1, folded: false };
    // const el = shallow(<Card {...props} />);
    // TODO requires stubbing of drawPokerCard from imported 'ab-vector-cards'
    it('should render <CardBack /> ', () => {
      // expect(el.find('CardBack').length).toEqual(1);
      // expect(el.find('CardFront').length).toEqual(0);
    });
  });

  describe('if user folds', () => {
    const props = { folded: true };
    const el = shallow(<Card {...props} />);
    it('should return null', () => {
      expect(el.type()).toEqual(null);
    });
  });

  describe('during showdown', () => {
    // const props = { cardNumber: 0, folded: false }; // greater than -1, and !null
    // const el = shallow(<Card {...props} />);
    // TODO requires stubbing of drawPokerCard from imported 'ab-vector-cards'
    it('should render <CardFront />', () => {
    //   expect(el.find('CardBack').length).toEqual(0);
    //   expect(el.find('CardFront').length).toEqual(1);
    });
  });
});
