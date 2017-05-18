import React, { PropTypes } from 'react';

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
    return (
      <div>
        <MessageList messages={this.props.messages} />
        <MessageBox onAddMessage={this.onAddMessage} />
      </div>
    );
  }
}

Chat.propTypes = {
  messages: PropTypes.object,
  onAddMessage: PropTypes.func,
};

export default Chat;
