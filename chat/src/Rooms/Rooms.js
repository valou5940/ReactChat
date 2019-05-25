import React from 'react';

export class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayUsersList: false,
      usersList: [],
      errorMessage: ''
    };
    this.handleNewRoom = this.handleNewRoom.bind(this);
    this.handleInviteAndCreate = this.handleInviteAndCreate.bind(this);
  }

  handleNewRoom() {
    // this.props.history.push('/chat');
    fetch('http://localhost:5000/users', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data !== 'No users connected') {
          this.setState({
            displayUsersList: true,
            usersList: data.users
          });
        } else {
          this.setState({
            displayUsersList: false,
            errorMessage: data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleInviteUser(user) {
    console.log(user);
  }

  handleInviteAndCreate() {
    this.props.history.push('/chat');
  }

  render() {
    const userList = (
      <ul>
        {this.state.usersList.map((user, index) => {
          return (
            <li key={index}>
              <button onClick={this.handleInviteUser.bind(this, user)}>{user.nickname}</button>
            </li>
          );
        })}
        <button type="submit" onClick={this.handleInviteAndCreate}>
          Create Channel
        </button>
      </ul>
    );

    const noUsers = this.state.errorMessage;

    return (
      <div>
        <h5>Rooms</h5>
        <div className="row">
          <div className="full-users-list col-6">
            <button onClick={this.handleNewRoom}>New Channel</button>
            {this.state.displayUsersList ? userList : noUsers}
          </div>
          <div className="full-rooms-list col-6">
            <button onClick={this.handleJoinRoom}>Join Channel</button>
          </div>
        </div>
      </div>
    );
  }
}
