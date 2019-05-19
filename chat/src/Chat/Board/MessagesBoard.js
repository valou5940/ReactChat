import React from 'react';
export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSameUser: false
    };
  }
  messagesEndRef = React.createRef();
  componentDidMount() {
    // const lastUser = this.props.displayedMsg[this.props.displayedMsg.length - 1];
    // const beforeLastUser = this.props.displayedMsg[this.props.displayedMsg.length - 2];
    // console.log(lastUser);
    // console.log(beforeLastUser);
    // if (lastUser !== undefined && beforeLastUser && undefined) {
    //   if (lastUser.user === beforeLastUser.user) {
    //     this.setState({
    //       isSameUser: true
    //     });
    //   } else {
    //     this.setState({
    //       isSameUser: false
    //     });
    //   }
    // }
    // this.scrollToBottom();
  }
  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }

  // scrollToBottom = () => {
  //   const messagesContainer = this.refs.messagesContainer;
  //   messagesContainer.scrollIntoView({ behavior: 'smooth' });
  // };

  render() {
    // const lastUser = this.props.displayedMsg[this.props.displayedMsg.length - 1];
    // const beforeLastUser = this.props.displayedMsg[this.props.displayedMsg.length - 2];
    // console.log(lastUser);
    // console.log(beforeLastUser);
    // if (lastUser !== undefined && beforeLastUser && undefined) {
    //   if (lastUser.user === beforeLastUser.user) {
    //     this.setState({
    //       isSameUser: true
    //     });
    //   } else {
    //     this.setState({
    //       isSameUser: false
    //     });
    //   }
    // }

    return (
      <div>
        <ul className="messages-list">
          {Array.from(this.props.displayedMsg).map((message, index) => {
            return (
              <div
                // ref={el => {
                //   this.messagesContainer = el;
                // }}
                className="ul-container"
                key={index}
              >
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
