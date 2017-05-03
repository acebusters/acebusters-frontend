import React from 'react';
import { shallow } from 'enzyme';
import { RebuyDialog } from '../index';

describe('Rebuy Dialog', () => {
  it('should not render the appropiate modal when balance is not sufficient ', () => {
    const props = {
      balance: 200,
      sb: 40,
      modalDismiss: () => {},
      handleRebuy: () => {},
      handleLeave: () => {},
    };
    const rebuyDialog = shallow(
      <RebuyDialog {...props} />
    );

    expect(rebuyDialog.nodes[0].props.children[0].props.children.props.defaultMessage).toEqual('Sorry!');
  });
});
