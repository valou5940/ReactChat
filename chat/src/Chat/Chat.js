import React from 'react';
import { MessagesBoard } from './Board/MessagesBoard';
import { Send } from './Board/Send';
import socketIOClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Connection } from './Login/Connection';
import { Users } from './Board/Users';

export class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messagesArray: [],
      socket: socketIOClient('http://localhost:3001'),
      nickname: '',
      user: '',
      users: [],
      logged: false
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.state.socket.on('dispatch-messages', messages => {
      this.setState({ messagesArray: messages });
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
      nickname: nickname
    });

    this.state.socket.emit('login', nickname);
  }

  handleMessage(message) {
    console.log(message);
    this.state.socket.emit('send-message', message);
  }

  render() {
    return (
      <div className="wrapper container">
        {!this.state.logged && <Connection onLogin={this.handleLogin.bind(this)} />}
        {this.state.logged && (
          <div className="board">
            <div className="row">
              <div className="messages col-8">
                <MessagesBoard displayedMsg={this.state.messagesArray} />
              </div>
              <div className="users col-4">
                <Users users={this.state.users} user={this.state.user} />
              </div>
            </div>
            <div className="row">
              <div className="send col-8">
                <Send onSendMessage={this.handleMessage} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
