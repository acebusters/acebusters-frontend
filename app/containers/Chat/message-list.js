import React from 'react';
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
      borderBottom: '1px solid black',
      height: '200px',
      overflow: 'auto',
    };
    return (
      <ul style={style} ref={(el) => { this.list = el; }}>
        {(this.props.messages || []).map((message, i) => {
          const string = message.signer
            ? <span><u>{ nickNameByAddress(message.signer) }</u> &gt; {message.message}</span>
            : <i style={{ color: 'lightslategray' }}>ORACLE: {message.message}</i>;
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
