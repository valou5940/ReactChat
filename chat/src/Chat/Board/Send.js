import React from 'react';
import {Smile} from "react-feather";
import {Picker} from "emoji-mart";

export class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      showEmojiPicker: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
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

  toggleEmojiPicker() {
        this.setState({
            showEmojiPicker: !this.state.showEmojiPicker,
        });
    }

    addEmoji(emoji) {
        console.log(this.state);
        const { message } = this.state;
        const text = `${message}${emoji.native}`;

        this.setState({
            message: text,
            showEmojiPicker: false,
        });
    }



  render() {
    return (
      <div>

          <ul
              className="chat-messages">

              {this.state.showEmojiPicker ? (<Picker set="emojione" onSelect={this.addEmoji} />) : null}
          </ul>
          <button
              type="button"
              className="toggle-emoji"
              onClick={this.toggleEmojiPicker}
          >
              <Smile />
          </button>
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
