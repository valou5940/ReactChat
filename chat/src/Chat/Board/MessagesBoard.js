import React from 'react';
export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSameUser: false
    };
  }

  render() {
    return (
      <div>
        <ul className="messages-list">
          {Array.from(this.props.displayedMsg).map((message, index) => {
            return (
              <div className="ul-container" key={index}>
                <li
                  className={
                    this.props.loggedUser === message.user ? 'messages-droite' : 'messages-gauche'
                  }
                >
                  {
                    <p>
                      <i className="user-chatting">'{message ? message.user.toUpperCase() : ''}'</i>
                      <span className="text-deco"> : {'{'}</span>
                      <br />
                      <span className="user-message"> {message.message} </span>
                      <br />
                      <span className="text-deco">{'}'}</span>
                    </p>
                  }
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}
