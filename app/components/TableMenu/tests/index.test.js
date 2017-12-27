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

      it('should display default components', () => {
        expect(el.find({ name: 'logo-wrapper' }).hostNodes().length).toEqual(1);
      });

      it('should display guest header', () => {
        expect(el.find({ name: 'item-title' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'item-title' }).hostNodes().text()).toEqual('Guest');
        expect(el.find({ name: 'identicon' }).hostNodes().length).toEqual(1);
      });

      it('should display closed menu', () => {
        expect(el.find({ name: 'sitout' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'standup' }).hostNodes().length).toEqual(1);
      });
    });

    describe('if menu open', () => {
      const newProps = Object.assign(props, { open: true });
      const el = mount(<TableMenu {...newProps} />);

      it('should display default components', () => {
        expect(el.find({ name: 'logo-wrapper' }).hostNodes().length).toEqual(1);
      });

      it('should display guest header', () => {
        expect(el.find({ name: 'item-title' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'item-title' }).hostNodes().text()).toEqual('Guest');
        expect(el.find({ name: 'identicon' }).hostNodes().length).toEqual(1);
      });

      it('should display guest menu', () => {
        expect(el.find({ name: 'lobby' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'register' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'signin' }).hostNodes().length).toEqual(1);
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

      it('should display default components', () => {
        expect(el.find({ name: 'logo-wrapper' }).hostNodes().length).toEqual(1);
      });

      it('should display user header', () => {
        expect(el.find({ name: 'item-title' }).hostNodes().text()).toEqual(props.nickName);
        expect(el.find({ name: 'identicon' }).hostNodes().length).toEqual(1);
      });

      it('should display closed menu', () => {
        expect(el.find({ name: 'sitout' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'standup' }).hostNodes().length).toEqual(1);
      });
    });

    describe('if menu open', () => {
      const newProps = Object.assign(props, { open: true });
      const el = mount(<TableMenu {...newProps} />);

      it('should display default components', () => {
        expect(el.find({ name: 'logo-wrapper' }).hostNodes().length).toEqual(1);
      });

      it('should display user header', () => {
        expect(el.find({ name: 'item-title' }).hostNodes().text()).toEqual(props.nickName);
        expect(el.find({ name: 'identicon' }).hostNodes().length).toEqual(1);
      });

      it('should display open user menu', () => {
        expect(el.find({ name: 'lobby' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'dashboard' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'preferences' }).hostNodes().length).toEqual(1);
        expect(el.find({ name: 'logout' }).hostNodes().length).toEqual(1);
      });
    });
  });
});
