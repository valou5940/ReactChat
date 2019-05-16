import React from 'react';
import {Smile} from "react-feather";
import {Picker} from "emoji-mart";

export class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isWriting : 0,
      usersWriting : [],
      showEmojiPicker: false,
      socket : this.props.socket
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

    componentDidMount() {
        this.state.socket.on('writing-message', usersWriting => {
            this.setState({
                isWriting : 1,
                usersWriting : usersWriting
            })
        });
        this.state.socket.on('finished-message', usersWriting => {
            this.setState({
                usersWriting : usersWriting,
            })
            console.log()
        });
    }


  sendMessage() {
   if(this.state.message !== '' && this.state.message !== undefined){
    this.props.onSendMessage(this.state.message);
    this.props.socket.emit('finished-message',this.props.user);
    this.setState({
      message: '',
      isWriting : 0
    });
   }
  }

    handleKeyDown(e){
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

  handleMessage(evt) {

    this.setState({
      message: evt.target.value
    });
     if (this.state.isWriting !== 1){
         this.props.socket.emit('writing-message',this.props.user);
     }
    if(evt.target.value === '' || evt.target.value === undefined){
        this.props.socket.emit('finished-message',this.props.user);
        this.setState({

            isWriting : 0
        });
    }

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





              <ul>
                  {this.state.usersWriting.filter(userWriting => userWriting !== this.props.user).map((userWriting, index) => {
                      return (
                          <div className="ul-container">
                              <li className="" key={index}>
                                  {userWriting + ' écrit ...'}

                              </li>

                          </div>

                      );
                  })}
              </ul>



          <ul
              className="isTyping">
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
          onKeyDown={this.handleKeyDown}
            />
        <input type="submit" onClick={this.sendMessage}  value="Send" />


      </div>
    );
  }
}
