import React from 'react';
import { MessagesBoard } from './Board/MessagesBoard';
import { Send } from './Board/Send';
import socketIOClient from 'socket.io-client';
import { Connection } from '../Connection/Connection';
import { Smile } from 'react-feather';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { Users } from './Board/Users/Users';

export class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messagesArray: [],
      socket: this.props.socket,
      loggedUser: this.props.location.login.self,
      user: '',
      users: [],
      errorMessage: '',
      isWriting: false,
      channelName: this.props.location.login.channelName
    };

    this.handleMessage = this.handleMessage.bind(this);

    this.state.socket.on('users-list', users => {
      console.log(users);
      this.setState({ users: users });
    });
  }

  componentDidMount() {
    this.state.socket.on('dispatch-messages', messages => {
      console.log(messages);
      this.setState({ messagesArray: messages });
    });

    this.state.socket.on('dispatch-message', message => {
      console.log(message);
      // let formattedDate;
      // formattedDate = message.date.getHours();
      // message.date = formattedDate;
      this.setState(prevState => ({
        messagesArray: [...prevState.messagesArray, message]
      }));
    });

    this.state.socket.on('users-list', users => {
      console.log(users);
      this.setState({ users: users });
    });

    // this.state.socket.on('user-created-room', user => {
    //   console.log(user.self);
    //   this.setState(prevState => ({
    //     users: [...prevState.users, user.self]
    //   }));
    //   this.state.socket.emit('users-list', this.state.users);
    // });

    this.state.socket.on('user-joined', user => {
      console.log(user);
      let userConnect = `${user.nickname} has connected !`;
      this.setState({ user: userConnect });
      // this.setState(prevState => ({
      //   users: [...prevState.users, user]
      // }));
      // this.state.socket.emit('users-list', this.state.users);
    });

    this.state.socket.on('user-disconnected', userDisconnected => {
      if (userDisconnected !== null) {
        let userLeft = `${userDisconnected.nickname} has disconnected !`;
        this.setState({ user: userLeft });
        // this.setState({
        //   users: this.state.users.filter(user => user.nickname !== userLeft)
        // });
        this.state.socket.emit('users-list', this.state.users);
      }
    });

    // this.state.socket.on('join-conversation', user => {
    //   if (user === this.state.loggedUser) {
    //     this.state.emit();
    //   }
    // });
  }

  handleMessage(message) {
    // message['channelName'] = this.state.channelName;
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

  handleNewConversation(user, self) {
    console.log(user, self);
    // this.state.socket.emit('switch-conversation', { user: user, self: self });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="messages-wrapper">
          <div className="messages-board row">
            <div className="users col-2">
              <Users
                self={this.state.loggedUser}
                users={this.state.users}
                user={this.state.user}
                isWriting={this.state.isWriting}
                onNewConversation={this.handleNewConversation.bind(this)}
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
      </div>
    );
  }
}
