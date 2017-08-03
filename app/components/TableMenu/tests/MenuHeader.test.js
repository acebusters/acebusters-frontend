import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import MenuHeader from '../MenuHeader';

describe('component.TableMenu.MenuHeader', () => {
  describe('mouse actions on header', () => {
    const props = {
      active: false,
      open: false,
      toggleMenuOpen: sinon.spy(),
      toggleMenuActive: sinon.spy(),
    };
    const el = mount(<MenuHeader {...props} />);

    describe('if user clicks header', () => {
      it('should call toggleMenuOpen func', () => {
        el.find('MenuHeader').simulate('click');
        sinon.assert.calledOnce(props.toggleMenuOpen);
        props.toggleMenuOpen.reset();
      });
    });

    describe('if user mouseDown header', () => {
      it('should call toggleMenuActive func', () => {
        el.find('MenuHeader').simulate('mouseDown');
        sinon.assert.calledOnce(props.toggleMenuActive);
        props.toggleMenuActive.reset();
      });
    });

    describe('if user mouseUp header', () => {
      it('should call toggleMenuActive func', () => {
        el.find('MenuHeader').simulate('mouseUp');
        sinon.assert.calledOnce(props.toggleMenuActive);
        props.toggleMenuActive.reset();
      });
    });

    describe('if user leaves button', () => {
      describe('and button is NOT active', () => {
        it('should NOT call toggleMenuActive func', () => {
          el.find('MenuHeader').simulate('mouseLeave');
          sinon.assert.notCalled(props.toggleMenuActive);
          props.toggleMenuActive.reset();
        });
      });

      describe('and button is active', () => {
        const newProps = Object.assign(props, { active: true });
        const la = mount(<MenuHeader {...newProps} />);
        it('should call toggleMenuActive func', () => {
          la.find('MenuHeader').simulate('mouseLeave');
          sinon.assert.calledOnce(props.toggleMenuActive);
          props.toggleMenuActive.reset();
        });
      });
    });
  });
});
