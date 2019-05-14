import React from 'react';

export class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  sendMessage() {
   if(this.state.message !== '' && this.state.message !== undefined){

    this.props.onSendMessage(this.state.message);
    this.setState({
      message: ''
    });
   }
  }

  handleMessage(evt) {
    this.setState({
      message: evt.target.value
    });
  }

  render() {
    return (
      <div>
        <input
          className="message-typing"
          type="text"
          placeholder="type message here..."
          value = {this.state.message}
          onChange={this.handleMessage}
        />
        <input type="submit" onClick={this.sendMessage} value="Send" />
      </div>
    );
  }
}
