/**
* Created by jzobro 20170605
*/
import React from 'react';
import { mount } from 'enzyme';
import TableMenu from '../index';
import { blocky } from '../../../app.config';

describe('components.TableMenu.TableMenu', () => {
  describe('if guest', () => {
    const props = {
      loggedIn: false,
      active: false,
      nickName: 'Guest',
      blocky: null,
    };
    describe('if menu closed', () => {
      const newProps = Object.assign(props, { open: false });
      const el = mount(<TableMenu {...newProps} />);

      it('should display closed menu', () => {
        expect(el.find({ name: 'sitout' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'standup' }).hostNodes().length).toEqual(1);
      });
    });
  });

  describe('if user', () => {
    const props = {
      loggedIn: true,
      active: false,
      nickName: 'DAWN',
      blocky,
    };
    describe('if menu closed', () => {
      const newProps = Object.assign(props, { open: false });
      const el = mount(<TableMenu {...newProps} />);

      it('should display closed menu', () => {
        expect(el.find({ name: 'sitout' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'standup' }).hostNodes().length).toEqual(1);
      });
    });
  });
});
