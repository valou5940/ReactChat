import React from 'react';

export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.displayedMsg.map((message, index) => {
            return (
              <li className="messages-list" key={index}>
                {message}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
