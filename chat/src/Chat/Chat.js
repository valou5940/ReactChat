import React from 'react';
import { MessagesBoard } from './Board/MessagesBoard';
import { Send } from './Board/Send';
import socketIOClient from 'socket.io-client';
import { Connection } from './Login/Connection';
import { Users } from './Board/Users';
import { Smile } from 'react-feather';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

export class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messagesArray: [],
      socket: socketIOClient('http://localhost:3001'),
      loggedUser: '',
      user: '',
      users: [],
      logged: false,
      errorMessage: '',
      isWriting: false
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.state.socket.on('dispatch-messages', messages => {
      console.log(messages);
      this.setState({ messagesArray: messages });
    });

    this.state.socket.on('dispatch-message', message => {
      console.log(message);
      this.setState(prevState => ({
        messagesArray: [...prevState.messagesArray, message]
      }));
    });

    this.state.socket.on('users-list', users => {
      console.log(users);
      this.setState({ users: users });
    });

    this.state.socket.on('user-connected', user => {
      let userConnect = `${user} has connected !`;
      this.setState({ user: userConnect });
    });

    this.state.socket.on('user-disconnected', user => {
      if (user !== null) {
        let userDisconnect = `${user} has disconnected !`;
        this.setState({ user: userDisconnect });
      }
    });
  }

  handleLogin(nickname) {
    console.log(this.state.users);
    if (this.state.users.find(user => user.nickname === nickname) === undefined) {
      this.setState({
        logged: true,
        loggedUser: nickname,
        errorMessage: ''
      });
      this.state.socket.emit('login', nickname);
    } else {
      this.setState({
        logged: false,
        errorMessage: `Nickname ${nickname} already taken!`
      });
    }
  }

  handleMessage(message) {
    console.log(message);
    this.state.socket.emit('send-message', message);
  }

  handleIsWriting(isWriting) {
    console.log(isWriting);
    this.setState({ isWriting: isWriting });
    this.state.socket.emit('is-writing', {
      nickname: this.state.loggedUser,
      isWriting: isWriting
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="login">
          {!this.state.logged && (
            <Connection
              errorMessage={this.state.errorMessage}
              onLogin={this.handleLogin.bind(this)}
            />
          )}
        </div>
        {this.state.logged && (
          <div className="messages-wrapper">
            <div className="messages-board row">
              <div className="users col-2">
                <Users
                  users={this.state.users}
                  user={this.state.user}
                  isWriting={this.state.isWriting}
                />
              </div>
              <div className="col-10 messages">
                <MessagesBoard
                  displayedMsg={this.state.messagesArray}
                  loggedUser={this.state.loggedUser}
                />
              </div>
            </div>
            <div className="row send">
              <div className="col-10 offset-2">
                <Send
                  onSendMessage={this.handleMessage}
                  loggedUser={this.state.loggedUser}
                  onIsWriting={this.handleIsWriting.bind(this)}
                  isWriting={this.state.isWriting}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
