import React from 'react';
import { shallow } from 'enzyme';
import LobbyMessage from 'containers/LobbyMessage';
import { TableStriped } from 'components/List';
import Button from 'components/Button';
import Lobby from 'components/Lobby';

const defaultProps = {
  web3Redux: {
    web3: () => {},
  },
  lobby: [],
};

describe('default state', () => {
  const props = { ...defaultProps };
  const el = shallow(<Lobby {...props} />);
  it('should show default components', () => {
    expect(el.find(LobbyMessage).length).toBe(1);
    expect(el.find(TableStriped).length).toBe(1);
    expect(el.find(Button).html()).toContain('Refresh');
  });
});
