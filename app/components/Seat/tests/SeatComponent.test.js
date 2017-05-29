/**
* Created by jzobro 20170524
*/
import React from 'react';
import { shallow } from 'enzyme';
import SeatComponent from '../index';

describe('components.seat.seatComponent', () => {
  // describe('activePlayer func', () => {});
  // describe('seatStatus func', () => {});
  describe('if seat is open', () => {
    describe('if NOT joined table', () => {
      const props = {
        open: true,
        myPos: undefined,
      };
      const el = shallow(<SeatComponent {...props} />);
      it('should render <ButtonJoinSeat />', () => {
        expect(el.find('ButtonJoinSeat').length).toEqual(1);
      });
    });

    describe('if joined table', () => {
      const props = {
        open: true,
        myPos: 0, // (number 0-5, not -1) (only exists if sitting at table)
        pos: 0, // to maxTable
      };
      const el = shallow(<SeatComponent {...props} />);
      it('should render <ButtonInvite />', () => {
        expect(el.find('ButtonInvite').length).toEqual(1);
      });
    });
  });

  describe('if seat is occupied', () => {
    describe('if logged-in user seat', () => {
      const props = {
        open: false,
        myPos: 0, // some number,
        pos: 0, // same number,
      };
      const el = shallow(<SeatComponent {...props} />);
      it('should render <Seat /> for other user', () => {
        expect(el.find('Seat').length).toEqual(1);
      });
    });
    describe('if other user seat', () => {
      const props = {
        open: false,
        myPos: 0, // some number,
        pos: 1, // different number,
      };
      const el = shallow(<SeatComponent {...props} />);
      it('should render <Seat /> for other user', () => {
        expect(el.find('Seat').length).toEqual(1);
      });
    });
  });

  // seat status func
  describe('if not at table yet and still pending', () => {
    const props = {
      pending: true,
      myPos: undefined,
    };
    const el = shallow(<SeatComponent {...props} />);
    it('should display "sitting-in"', () => {
      expect(el.props().seatStatus).toEqual('sitting-in');
    });
  });

  describe('if at table and not pending', () => {
    const props = {
      pending: false,
      myPos: 0, // any number 0-whatever, maybe 10
    };
    const el = shallow(<SeatComponent {...props} />);
    it('should return seatStatus as EMPTY', () => {
      expect(el.props().seatStatus).toEqual('EMPTY');
    });
  });

  describe('if standing-up', () => {
    const props = {
      pending: true,
      myPos: 0, // any number 0-whatever, maybe 10
    };
    const el = shallow(<SeatComponent {...props} />);
    it('should return seatStatus as "standing-up"', () => {
      expect(el.props().seatStatus).toEqual('standing-up');
    });
  });


  // TODO add test for sitout condition of the seatStatus method
});
