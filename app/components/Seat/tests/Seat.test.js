/**
* Created by jzobro 20170524
*/
import React from 'react';
import { shallow } from 'enzyme';
import Seat from '../Seat';
import { STATUS_MSG } from '../../../app.config';

describe('components.seat.seat', () => {
  describe('render default imported components', () => {
    const el = shallow(<Seat />);
    it('should show default components', () => {
      expect(el.find('SeatInfo').length).toEqual(1);
      expect(el.find('StatusAction').length).toEqual(1);
    });
  });

  describe('seat status', () => {
    describe('if seat is NOT ready', () => {
      const props = {
        activePlayer: true,
        coords: [0, 0],
        seatStatus: STATUS_MSG.sittingIn,
      };
      it('should show seat status', () => {
        const el = shallow(<Seat {...props} />);
        const la = el.findWhere((n) => n.text() === props.seatStatus.msg);
        expect(la.length).toEqual(1);
      });
    });

    describe('if seat is ready', () => {
      const props = { seatStatus: STATUS_MSG.active };
      it('should show <CardsComponent/>', () => {
        const el = shallow(<Seat {...props} />);
        expect(el.find('CardsComponent').length).toEqual(1);
      });
    });
  });
});
