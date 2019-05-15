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
            <div className="ul-container">
              <li className={message.user === this.props.user ? "messages-droite" : "messages-gauche" } key={index}>
                {message.user !== this.props.user ? message.user + ": " +  message.message   : message.message}

              </li>

            </div>

            );
          })}
        </ul>
      </div>
    );
  }
}


