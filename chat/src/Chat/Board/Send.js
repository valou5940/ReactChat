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
    this.props.onSendMessage(this.state.message);
  }

  handleMessage(evt) {
    this.setState({
      message: evt.target.value
    });
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="type message here..." onChange={this.handleMessage} />
        <input type="submit" onClick={this.sendMessage} value="Send" />
      </div>
    );
  }
}
