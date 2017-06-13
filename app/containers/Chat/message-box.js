import React from 'react';

class MessageBox extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSend = this.handleSend.bind(this);
  }

  handleSend(event) {
    if (event.which === 13) {
      const text = this.input.value.trim();
      event.preventDefault();
      this.props.onAddMessage(text);
      this.input.value = '';
    }
  }

  render() {
    return (
      <div>
        <input
          placeholder="enter message..."
          onKeyDown={this.handleSend}
          ref={(input) => { this.input = input; }}
          style={{
            width: '100%',
            background: 'whitesmoke',
            boxShadow: 'inset black 0 0 3px 0px',
            padding: '10px',
            fontSize: 'large',
          }}
        />
      </div>
    );
  }
}

MessageBox.propTypes = {
  onAddMessage: React.PropTypes.func,
};

export default MessageBox;
