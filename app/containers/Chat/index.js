import React, { PropTypes } from 'react';

import ChatPlaceholder from '../../components/Chat/placeholder';
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
    const box = this.props.readonly ? null : <MessageBox onAddMessage={this.onAddMessage} />;
    const area = (this.props.messages && this.props.messages.length)
      ? <MessageList messages={this.props.messages} />
      : <ChatPlaceholder>{this.props.placeholder}</ChatPlaceholder>;
    return (
      <div>
        {area}
        {box}
      </div>
    );
  }
}

Chat.propTypes = {
  messages: PropTypes.array,
  onAddMessage: PropTypes.func,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default Chat;
