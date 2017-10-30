import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
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
  makeLatestHandSelector,
} from '../../containers/Table/selectors';

import { makeMyPendingSelector } from '../../containers/Seat/selectors';
import { makeSelectPrivKey } from '../../containers/AccountProvider/selectors';
import { sendMessage } from '../../containers/Table/actions';

import messages from './messages';

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
    const { isOpen } = this.state;
    const { myPos, state, playerCount, params: { tableAddr }, messages: chatMessages, handId, myPending } = this.props;
    return (
      <CurtainWrapper isOpen={isOpen}>
        <CurtainToggler onClick={this.toggle} isOpen={isOpen} />
        <CurtainHeader />
        <Chat
          onAddMessage={this.sendMessage}
          messages={chatMessages}
          readonly={myPending || !(myPos != null)}
          placeholder={
            <FormattedHTMLMessage
              {...messages.placeholder}
              values={{
                tableAddr: tableAddr.substring(2, 8),
                handId,
                state,
                playerCount,
              }}
            />
          }
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
  handId: makeLatestHandSelector(),
  messages: makeMessagesSelector(),
  playerCount: makePlayersCountSelector(),
  myPending: makeMyPendingSelector(),
  myPos: makeMyPosSelector(),
});

Curtain.propTypes = {
  state: PropTypes.string,
  privKey: PropTypes.string,
  myPos: PropTypes.number,
  myPending: PropTypes.bool,
  sendMessage: PropTypes.func,
  messages: PropTypes.array,
  handId: PropTypes.number,
  playerCount: PropTypes.number,
  params: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Curtain);
