/**
* Created by jzobro 20170607
*/
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import MenuItem from '../MenuItem';

describe('components.TableMenu.MenuItem', () => {
  const props = {
    item: {
      name: 'button',
      onClick: sinon.spy(),
    },
    toggleMenuOpen: sinon.spy(),
  };

  describe('handelClick func', () => {
    describe('if menu is open', () => {
      it('should call toggleMenuOpen func', () => {
        const newProps = Object.assign(props, { open: true });
        const el = mount(<MenuItem {...newProps} />);
        el.find({ name: 'button' }).hostNodes().simulate('click');
        sinon.assert.calledOnce(props.toggleMenuOpen);
        sinon.assert.calledOnce(props.item.onClick);
        props.toggleMenuOpen.reset();
        props.item.onClick.reset();
      });
    });

    describe('if menu is closed', () => {
      it('should NOT call toggleMenuOpen func', () => {
        const newProps = Object.assign(props, { open: false });
        const el = mount(<MenuItem {...newProps} />);
        el.find({ name: 'button' }).hostNodes().simulate('click');
        sinon.assert.notCalled(props.toggleMenuOpen);
        sinon.assert.calledOnce(props.item.onClick);
        props.toggleMenuOpen.reset();
      });
    });
  });
});
