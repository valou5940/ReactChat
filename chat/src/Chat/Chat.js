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
      logged: false
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
      this.setState({ user: user });
    });

    this.state.socket.on('user-disconnected', user => {
      this.setState({ user: user });
    });
  }

  handleLogin(nickname) {
    this.setState({
      logged: true,
      loggedUser: nickname
    });

    this.state.socket.emit('login', nickname);
  }

  handleMessage(message) {
    console.log(message);
    this.state.socket.emit('send-message', message);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="login">
          {!this.state.logged && <Connection onLogin={this.handleLogin.bind(this)} />}
        </div>
        {this.state.logged && (
          <div className="messages-wrapper">
            <div className="messages-board row">
              <div className="users col-2">
                <Users users={this.state.users} user={this.state.user} />
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
                <Send onSendMessage={this.handleMessage} loggedUser={this.state.loggedUser} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
