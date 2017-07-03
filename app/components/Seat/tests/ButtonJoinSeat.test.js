/**
* Created by jzobro 20170529
*/
import React from 'react';
import { mount } from 'enzyme';
import ButtonJoinSeat from '../ButtonJoinSeat';

describe('components.seat.ButtonJoinSeat', () => {
  describe('default state', () => {
    const props = {
      coords: [0, 0],
      pending: false,
      onClickHandler: () => {},
    };
    it('should show "Join" message', () => {
      const el = mount(<ButtonJoinSeat {...props} />);

      expect(el.find('.fa-plus').length).toEqual(1);
      expect(el.text()).toEqual('Join');
    });
  });
});
