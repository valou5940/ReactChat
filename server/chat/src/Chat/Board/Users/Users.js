import React from 'react';
import { Conversations } from './Conversations';

export class Users extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewConversation = this.handleNewConversation.bind(this);
    console.log(this.props);
  }

  handleNewConversation(user) {
    console.log(user);
    this.props.onNewConversation(user.nickname, this.props.self);
  }

  render() {
    let users = [...this.props.users];
    const self = this.props.self.nickname;
    users = users.filter(user => user.nickname !== self);
    return (
      <div>
        <h5>Users connected</h5>
        <hr />
        <ul className="users-list">
          <li>{self.toUpperCase()}</li>
          {users.map((user, index) => {
            return (
              <li key={index} onClick={this.handleNewConversation.bind(this, user)}>
                <span className="new-conversation-button">{user.nickname.toUpperCase()}</span>
                {user.isWriting ? ' typing...' : ''}
              </li>
            );
          })}
        </ul>
        <br />
        <div className="connect-event">
          <span>
            {this.props.user !== null && this.props.user.split(' ')[0] !== self
              ? this.props.user
              : ''}
          </span>
        </div>
        <hr />
        <Conversations />
      </div>
    );
  }
}
