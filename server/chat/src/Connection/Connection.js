import React from 'react';
import Api from '../Services/Api';

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
    console.log(this.state.nickname);

    Api.prototype
      .login(this.state.nickname)
      .then(login => {
        console.log('Request succeeded with  response', login);
        if (login === 'Nickname is already taken !') {
          this.setState({ nickname: '' });
        } else {
          //navigate to room
          this.props.onLogin(login);
          this.props.history.push({
            pathname: '/rooms',
            login: {
              user: login
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
