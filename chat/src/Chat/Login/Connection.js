import React from 'react';

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
    this.props.onLogin(this.state.nickname);
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="choose a nickname" onChange={this.handleLogin} />
        <input type="submit" onClick={this.login} value="Connect" disabled={!this.state.nickname} />
        {this.props.errorMessage && <p className="error">{this.props.errorMessage}</p>}
      </div>
    );
  }
}
