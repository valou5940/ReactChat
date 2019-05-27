import React from 'react';
import socketIOClient from 'socket.io-client';

export class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.login = this.login.bind(this);
  }

  handleLogin(evt) {
    if (evt.target.value !== null && evt.target.value !== undefined) {
      this.setState({
        nickname: evt.target.value
      });
    }
  }

  login() {
    // this.props.onLogin(this.state.nickname);
    // this.state.socket.emit('login', this.state.nickname);
    console.log(this.state.nickname);
    fetch('http://localhost:5000/user', {
      method: 'post',
      body: JSON.stringify({ nickname: this.state.nickname }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Request succeeded with  response', data);
        if (data === 'Nickname is already taken !') {
          this.setState({ nickname: '' });
        } else {
          //navigate to room
          this.props.history.push({
            pathname: '/rooms',
            login: {
              user: data.user
            }
          });
        }
      })
      .catch(error => {
        console.log('Request failed', error);
      });
  }

  render() {
    return (
      <div className="login">
        <input type="text" placeholder="choose a nickname" onChange={this.handleLogin} />
        <input type="submit" onClick={this.login} value="Connect" disabled={!this.state.nickname} />
        {this.props.errorMessage && <p className="error">{this.props.errorMessage}</p>}
      </div>
    );
  }
}
