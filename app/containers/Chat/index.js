import React from 'react';
import PropTypes from 'prop-types';

import {
  ChatPlaceholder,
  ChatContainer,
  ChatArea,
  ChatBox,
} from '../../components/Chat';
import MessageList from './message-list';
import MessageBox from './message-box';

export class Chat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onAddMessage = this.onAddMessage.bind(this);
  }
  onAddMessage(message) {
    this.props.onAddMessage(message);
  }
  render() {
    const { readonly, messages, placeholder } = this.props;

    return (
      <ChatContainer>
        <ChatArea>
          {(messages && messages.length) &&
            <MessageList messages={messages} />}

          {!(messages && messages.length) &&
            <ChatPlaceholder>{placeholder}</ChatPlaceholder>}
        </ChatArea>
        <ChatBox>
          {!readonly &&
            <MessageBox onAddMessage={this.onAddMessage} />
          }
        </ChatBox>
      </ChatContainer>
    );
  }
}

Chat.propTypes = {
  messages: PropTypes.array,
  onAddMessage: PropTypes.func,
  readonly: PropTypes.bool,
  placeholder: PropTypes.any,
};

export default Chat;
