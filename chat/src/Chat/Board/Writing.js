import React from 'react';

export class Writing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.usersWriting
            .filter(userWriting => userWriting !== this.props.user)
            .map((userWriting, index) => {
              return (
                <div className="ul-container" key={index}>
                  <li className="">{userWriting + ' écrit ...'}</li>
                </div>
              );
            })}
        </ul>
      </div>
    );
  }
}
