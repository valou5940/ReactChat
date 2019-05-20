import React from 'react';
import { Smile } from 'react-feather';
import { Picker } from 'emoji-mart';

export class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      showEmojiPicker: false
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  sendMessage() {
    if (this.state.message !== '' && this.state.message !== undefined) {
      let message = { message: this.state.message, user: this.props.loggedUser };
      this.props.onSendMessage(message);
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

  handleKeyPress(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.sendMessage();
    }
  }

  toggleEmojiPicker() {
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker
    });
  }

  addEmoji(emoji) {
    console.log(this.state);
    const { message } = this.state;
    const text = `${message}${emoji.native}`;

    this.setState({
      message: text,
      showEmojiPicker: false
    });
  }

  render() {
    return (
      <div className="send-container">
        <ul className="chat-messages">
          {this.state.showEmojiPicker ? <Picker set="emojione" onSelect={this.addEmoji} /> : null}
        </ul>
        <button type="button" className="toggle-emoji" onClick={this.toggleEmojiPicker}>
          <Smile />
        </button>
        <input
          className="message-sender"
          type="text"
          placeholder="type message here..."
          value={this.state.message}
          onChange={this.handleMessage}
          onKeyPress={this.handleKeyPress}
        />
        <input className="submit-button" type="submit" onClick={this.sendMessage} value="Send" />
      </div>
    );
  }
}
