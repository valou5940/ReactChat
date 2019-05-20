import React from 'react';
export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.refs.messageRef.scrollIntoView(false, { behavior: 'smooth' });
  };

  render() {
    return (
      <div>
        <ul className="messages-list" ref="messageRef">
          {this.props.displayedMsg.length !== 0
            ? Array.from(this.props.displayedMsg).map((message, index) => {
                return (
                  <div className="ul-container col-12" key={index}>
                    <li
                      className={
                        this.props.loggedUser === message.user
                          ? 'messages-droite'
                          : 'messages-gauche'
                      }
                    >
                      {
                        <p>
                          <i className="user-chatting">
                            '{message ? message.user.toUpperCase() : ''}'
                          </i>
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
              })
            : ''}
        </ul>
        {/* <div style={{ bottom: '0', position: 'fixed' }} ref="messageRef" /> */}
      </div>
    );
  }
}
