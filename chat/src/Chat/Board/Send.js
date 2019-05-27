import React from 'react';
import { Smile } from 'react-feather';
import { Picker } from 'emoji-mart';
// import sendButton from './paper-plane-regular.svg';

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
      const date = new Date();
      console.log('LOGGED USER ', this.props.loggedUser);
      // let dateMsg = date.getHours() + ':' + date.getMinutes();
      let message = { text: this.state.message, user: this.props.loggedUser, date: date };
      this.props.onSendMessage(message);
      this.props.onIsWriting(!this.props.isWriting);
      this.setState({
        message: ''
      });
    }
  }

  handleMessage(evt) {
    if (evt.target.value !== '' && evt.target.value !== null && !this.props.isWriting) {
      this.props.onIsWriting(!this.props.isWriting);
    } else if (evt.target.value === '') {
      this.props.onIsWriting(!this.props.isWriting);
    }

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
          value={this.state.message}
          onChange={this.handleMessage}
          onKeyPress={this.handleKeyPress}
        />
        <button className="submit-button" type="submit" onClick={this.sendMessage}>
          {/* <img src={sendButton} alt="send" width="20px" height="20px" /> */}
        </button>
      </div>
    );
  }
}
