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
      connectionMessage: '',
      messageInput: '',
      socket: socketIOClient('http://localhost:3001'),
      nickname: '',
      users: [],
      logged: false
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.state.socket.on('chatMessage', message => {
      this.setState({ messageInput: message });
    });

    this.state.socket.on('login', users => {
      console.log(users);
      this.setState(prevState => ({
        users: [...prevState.users, users]
      }));
    });
  }

  handleLogin(nickname) {
    // this.setState(prevState => ({
    //   nickname: [...prevState.nickname, nickname]
    // }));

    console.log(this.state.nickname);

    this.setState({
      logged: true,
      nickname: nickname
    });

    this.state.socket.emit('login', nickname);
  }

  handleMessage(message) {
    console.log(message);
    this.state.socket.emit('chatMessage', message);
  }

  render() {
    return (
      <div className="wrapper">
        {!this.state.logged && <Connection onLogin={this.handleLogin.bind(this)} />}
        {this.state.logged && (
          <div className="board">
            <MessagesBoard displayedMsg={this.state.messageInput} />
            <Send onSendMessage={this.handleMessage} />
            <Users users={this.state.users} />
          </div>
        )}
      </div>
    );
  }
}
