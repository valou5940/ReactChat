import React from 'react';

export class Users extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.users);
  }

  render() {
    const users = [...this.props.users];
    return (
      <div className="users">
        <h3>Users connected :</h3>
        <ul>
          {users.map((nickname, indx) => {
            return <li key={indx}>{nickname}</li>;
          })}
        </ul>
        {/* <span>{this.props.user} connected</span> */}
      </div>
    );
  }
}
