import React from 'react';
import Api from '../Services/Api.js';

export class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      displayUsersList: false,
      displayChannels: false,
      usersList: [],
      usersInvited: [],
      errorMessage: '',
      channelName: '',
      channelsList: [],
      currentUser: this.props.location.login.user
    };

    console.log(this.props);

    if (this.props.location.login !== undefined) {
      this.state.socket.emit('user-joining-channel', this.state.currentUser);
    }

    this.handleNewChannel = this.handleNewChannel.bind(this);
    this.handleInviteAndCreate = this.handleInviteAndCreate.bind(this);
    this.onChannelName = this.onChannelName.bind(this);
    this.handleJoinChannel = this.handleJoinChannel.bind(this);
  }

  componentWillMount() {
    this.setState({
      displayUsersList: false,
      displayChannels: false
    });
  }

  componentDidMount() {
    // this.state.socket.on('reconnect', user => {
    //   console.log(user);
    //   this.setState({
    //     currentUser: user
    //   });
    //   this.state.socket.emit('user-joining-channel', this.state.currentUser);
    // });

    this.state.socket.on('user-choosing-channel', user => {
      console.log(user);
      this.setState(prevState => ({
        usersList: [...prevState.usersList, user]
      }));
    });

    this.state.socket.on('user-left', userLeft => {
      const newUserList = this.state.usersList.filter(user => user.nickname !== userLeft.nickname);
      this.setState({
        usersList: newUserList
      });
      console.log('user has left', userLeft);
      console.log('userlist', this.state.usersList);
    });
  }

  // get full userlist
  handleNewChannel() {
    // this.props.history.push('/chat');
    Api.prototype
      .getFullUsersList()
      .then(users => {
        this.setState({
          displayUsersList: true,
          usersList: users
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // invite users to join channel
  handleInviteUser(user) {
    const isInvited = this.state.usersInvited.find(
      userInvited => userInvited.nickname === user.nickname
    );
    this.setState(prevState => ({
      usersInvited: [...prevState.usersInvited, { nickname: user.nickname, isInvited: !isInvited }]
    }));
  }

  // create new channel with invited users
  handleInviteAndCreate() {
    Api.prototype
      .setUserChannel(this.state.currentUser, this.state.channelName)
      .then(user => {
        this.setState({
          currentUser: user,
          channelName: user.channel.channelName
        });

        this.props.history.push({
          pathname: '/chat',
          login: {
            self: this.state.currentUser,
            channelName: this.state.channelName
          }
        });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.state.socket.emit('create-channel', {
          users: this.state.usersInvited,
          channelName: this.state.channelName,
          self: this.state.currentUser
        });
      });
  }

  // set channel name
  onChannelName(evt) {
    this.setState({
      channelName: evt.target.value
    });
  }

  // get channels list
  handleJoinChannel() {
    Api.prototype
      .getChannelsList()
      .then(channels => {
        this.setState({
          displayChannels: true,
          channelsList: channels
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // join selected channel
  joinChannel(channel) {
    let messagesInChannel;
    let usersInChannel;
    console.log('channel name:', channel);
    console.log('user : ', this.state.currentUser);
    Api.prototype
      .setUserChannel(this.state.currentUser, channel.channelName)
      .then(user => {
        this.setState({
          currentUser: user,
          channelName: user.channel.channelName
        });

        return new Promise((resolve, reject) => {
          Api.prototype
            .getChannelUserList(user.channel.channelName)
            .then(users => {
              usersInChannel = users;
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              Api.prototype
                .getChannelMessagesList(user.channel.channelName)
                .then(messages => {
                  messagesInChannel = messages;
                  resolve(messagesInChannel);
                })
                .catch(error => {
                  console.log(error);
                  reject(error);
                });
            });
        });
      })
      .then(() => {
        console.log('message in channel ', messagesInChannel);
        this.props.history.push({
          pathname: '/chat',
          login: {
            self: this.state.currentUser,
            channelName: this.state.channelName
          },
          messages: messagesInChannel,
          users: usersInChannel
        });
        this.state.socket.emit('join-channel', this.state.currentUser);
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this.setState({ socket: '' });
  }

  render() {
    // display users list
    let userList = (
      <ul>
        {this.state.usersList.map((user, index) => {
          return (
            <li key={index}>
              <button onClick={this.handleInviteUser.bind(this, user)}>{user.nickname}</button>
            </li>
          );
        })}
        <div>
          <input type="text" onChange={this.onChannelName} value={this.state.channelName} />
          <button type="submit" onClick={this.handleInviteAndCreate}>
            Create Channel
          </button>
        </div>
      </ul>
    );

    const noUsers = this.state.errorMessage;

    // display channels list
    const channels = (
      <ul>
        {this.state.channelsList.map((channel, index) => {
          return (
            <li key={index}>
              <button onClick={this.joinChannel.bind(this, channel)}>{channel.channelName}</button>
            </li>
          );
        })}
      </ul>
    );

    const noChannels = 'No Channels';
    return (
      <div>
        <h5>Channels</h5>
        <div className="row">
          <div className="full-users-list col-6">
            <button onClick={this.handleNewChannel}>New Channel</button>
            {this.state.displayUsersList ? userList : noUsers}
          </div>
          <div className="full-rooms-list col-6">
            <button onClick={this.handleJoinChannel}>Join Channel</button>
            {this.state.displayChannels ? channels : noChannels}
          </div>
        </div>
      </div>
    );
  }
}
