import React from 'react';
export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.displayedMsg);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.refs.messageRef.scrollIntoView(false, { behavior: 'smooth' });
  };
  render() {
    return (
      <div className="messages-list-wrapper">
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
                        <div className="message-wrapper">
                          <span className="date-msg">{message.date}</span>
                          <span className="text-deco">_</span>
                          <span>
                            <i className="user-chatting">
                              '{message ? message.user.toUpperCase() : ''}'
                            </i>
                          </span>
                          <span className="text-deco"> : {'{'}</span>
                          {/* <br /> */}
                          <p className="user-message"> {message.text} </p>
                          {/* <br /> */}
                          <span className="text-deco">{'}'}</span>
                        </div>
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
