import React from 'react';
import { shallow } from 'enzyme';
import JoinDialog from '../index';

describe('Join Dialog', () => {
  it('should not render the appropiate modal when balance is not sufficient ', () => {
    const props = {
      balance: 200,
      sb: 40,
      pos: 1,
      modalDismiss: () => {},
      handleJoin: () => {},
    };
    const joinDialog = shallow(
      <JoinDialog {...props} />
    );
    expect(joinDialog.nodes[0].props.children[0].props.children.props.defaultMessage).toEqual('Sorry!');
  });
});
