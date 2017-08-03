/**
* Created by jzobro 20170525
*/
import React from 'react';
import { shallow, mount } from 'enzyme';
import StatusAction from '../StatusAction';

describe('components.seat.StatusAction', () => {
  describe('if seat turn for action, and timeLeft', () => {
    const props = {
      whosTurn: 0,
      pos: 0,
      seatStatus: {},
      timeLeft: 50,
    };
    it('should render <SeatTimer/>', () => {
      const el = shallow(<StatusAction {...props} />);
      expect(el.find('SeatTimer').length).toEqual(1);
    });
  });

  describe('if seat is in sitout', () => {
    const props = {
      whosTurn: 0,
      pos: 1,
      sitout: 1,
      seatStatus: {
        type: 'seat',
        style: 'info',
        msg: 'sitting out',
      },
    };
    it('should render <SitoutTimer/>', () => {
      const el = shallow(<StatusAction {...props} />);
      expect(el.find('SitoutTimer').length).toEqual(1);
    });
  });

  describe('if seat has a previous action', () => {
    const props = {
      whosTurn: 0,
      pos: 1,
      sitout: undefined,
      showStatus: {
        type: 'action',
        msg: 'check',
        style: 'success',
      },
    };
    it('should show action msg as innter text', () => {
      const el = mount(<StatusAction {...props} />);
      expect(el.text()).toEqual('check');
    });
  });
});
