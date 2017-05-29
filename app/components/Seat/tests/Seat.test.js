/**
* Created by jzobro 20170524
*/
import React from 'react';
import { shallow } from 'enzyme';
import Seat from '../Seat';

describe('components.seat.seat', () => {
  describe('render default imported components', () => {
    const el = shallow(<Seat />);
    it('should show <SeatInfo/>', () => {
      expect(el.find('SeatInfo').length).toEqual(1);
    });
    it('should show <StatusAction/>', () => {
      expect(el.find('StatusAction').length).toEqual(1);
    });
  });

  describe('seat status', () => {
    describe('if seat is NOT ready', () => {
      const props = {
        activePlayer: true,
        coords: [0, 0],
        seatStatus: 'sitting-out',
      };
      it('should show seat status', () => {
        const el = shallow(<Seat {...props} />);
        const la = el.findWhere((n) => n.text() === 'sitting-out');
        expect(la.length).toEqual(1);
      });
    });

    describe('if seat is ready', () => {
      const props = { seatStatus: 'EMPTY' };
      it('should show <CardsComponent/>', () => {
        const el = shallow(<Seat {...props} />);
        expect(el.find('CardsComponent').length).toEqual(1);
      });
    });
  });
});
