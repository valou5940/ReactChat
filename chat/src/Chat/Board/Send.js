import React from 'react';

export class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        text : '',

      }
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  sendMessage() {
    if (this.state.message.text !== '' && this.state.message.text !== undefined) {
      console.log("message envoyé " + this.state.message.text)
      this.props.onSendMessage(this.props.user + ': ' + this.state.message.text );
      this.setState({
        message: {text: ''}
      });
    }
  }

  handleMessage(evt) {
    this.setState({
      message: {text : evt.target.value}
    });
  }

  render() {
    return (
      <div>
        <input
          className="message-typing"
          type="text"
          placeholder="type message here..."
          value = {this.state.message.text}
          onChange={this.handleMessage}
        />
        <input type="submit" onClick={this.sendMessage} value="Send" />
      </div>
    );
  }
}
