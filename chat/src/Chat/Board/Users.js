import React from 'react';

export class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const users = [...this.props.users];
    return (
      <div>
        <h3>Users connected :</h3>
        <ul>
          {users.map((nickname, indx) => {
            return <li key={indx}>{nickname}</li>;
          })}
        </ul>
        <div className="connect-event">
          <span>{this.props.user}</span>
        </div>
      </div>
    );
  }
}
