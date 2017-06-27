import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  CurtainWrapper,
  CurtainHeader,
} from '../../components/Curtain';
import CurtainToggler from '../../components/Curtain/CurtainToggler';

import Chat from '../../containers/Chat';

import {
  makeHandStateSelector,
  makeMessagesSelector,
  makePlayersCountSelector,
  makeMyPosSelector,
} from '../../containers/Table/selectors';

import { makeSelectPrivKey } from '../../containers/AccountProvider/selectors';

import { sendMessage } from '../../containers/Table/actions';

class Curtain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = { isOpen: false };
  }

  sendMessage(message) {
    this.props.sendMessage(message, this.props.params.tableAddr, this.props.privKey);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const isTakePartOfAGame = this.props.myPos != null;
    const ta = this.props.params.tableAddr.substring(2, 8);
    const chatPlaceholder = `table <${ta}> in state ${this.props.state} has ${this.props.playerCount || 'no'} player${this.props.playerCount === 1 ? '' : 's'}.`;
    const isOpen = this.state.isOpen;
    return (
      <CurtainWrapper isOpen={isOpen}>
        <CurtainToggler onClick={this.toggle} isOpen={isOpen} />
        <CurtainHeader />
        <Chat
          onAddMessage={this.sendMessage}
          messages={this.props.messages}
          readonly={!isTakePartOfAGame}
          placeholder={chatPlaceholder}
        />
      </CurtainWrapper>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    sendMessage: (message, tableAddr, privKey) => dispatch(sendMessage(message, tableAddr, privKey)),
  };
}

const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  state: makeHandStateSelector(),
  messages: makeMessagesSelector(),
  playerCount: makePlayersCountSelector(),
  myPos: makeMyPosSelector(),
});

Curtain.propTypes = {
  state: PropTypes.string,
  privKey: PropTypes.string,
  myPos: PropTypes.number,
  sendMessage: PropTypes.func,
  messages: PropTypes.array,
  playerCount: PropTypes.number,
  params: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Curtain);
