import React from 'react';
import {
  baseColor,
  white,
} from 'variables';

import { nickNameByAddress } from '../../services/nicknames';

class MessageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    this.list.scrollTop = this.list.scrollHeight - this.list.clientHeight;
  }
  render() {
    const style = {
      width: '100%',
      margin: '0',
      listStyleType: 'none',
      padding: '0 0 5px 0',
      overflow: 'auto',
      height: '100%',
    };
    return (
      <ul style={style} ref={(el) => { this.list = el; }}>
        {(this.props.messages || []).map((message, i) => {
          const string = message.signer
            ? <span style={{ color: white }}>{ nickNameByAddress(message.signer) }: {message.message}</span>
            : <i style={{ color: baseColor }}>ORACLE: {message.message}</i>;
          return (<li style={{ padding: '5px 5px 0 5px' }} key={i}>{string}</li>);
        })}
      </ul>
    );
  }
}

MessageList.propTypes = {
  messages: React.PropTypes.array,
};

export default MessageList;
