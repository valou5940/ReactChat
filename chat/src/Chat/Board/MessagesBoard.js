import React from 'react';

export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.displayedMsg);
  }

  render() {
    return (
      <div>
        <ul>
          {Array.from(this.props.displayedMsg).map((message, index) => {
            return (
              <li className="messages-list" key={index}>
                {message.message} from {message.user}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
