import React from 'react';
import { shallow } from 'enzyme';
import SeatTimer from '../SeatTimer';

// timerProgress: PropTypes.number,
// timerType: PropTypes.string, // sitout or action

describe('components.seat.SeatTimer', () => {
  describe('sitout timer', () => {
    it('should display grey sitout timer', () => {});
  });

  describe('action timer', () => {
    describe('with timerProgress <= 60', () => {
      it('should display a "active" color', () => {
        const el = shallow(<SeatTimer timeLeft={60} />);
        const la = el.findWhere(
          (n) => n.props().type === 'active'
        );
        expect(la.length).toEqual(1);
      });
    });
    describe('with timerProgress <= 30', () => {
      it('should display a "warning" color', () => {
        const el = shallow(<SeatTimer timeLeft={30} />);
        const la = el.findWhere(
          (n) => n.props().type === 'warning'
        );
        expect(la.length).toEqual(1);
      });
    });
    describe('with timerProgress <= 0', () => {
      it('should display a "danger" color', () => {
        const el = shallow(<SeatTimer timeLeft={0} />);
        const la = el.findWhere(
          (n) => n.props().type === 'danger'
        );
        expect(la.length).toEqual(1);
      });
    });
  });
});
