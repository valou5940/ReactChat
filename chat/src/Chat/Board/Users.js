import React from 'react';

export class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const users = [...this.props.users];
    return (
      <div>
        <h5>Users connected</h5>
        <hr />
        <ul className="users-list">
          {users.map((user, index) => {
            return <li key={index}>{user}</li>;
          })}
        </ul>
        <hr />
        <div className="connect-event">
          <span>{this.props.user} has connected !</span>
        </div>
      </div>
    );
  }
}
