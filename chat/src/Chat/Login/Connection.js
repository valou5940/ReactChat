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
    this.setState({
      nickname: evt.target.value
    });
  }

  login() {
    this.props.onLogin(this.state.nickname);
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="choose a nickname" onChange={this.handleLogin} />
        <input type="submit" onClick={this.login} value="Connect" />
        {this.props.errorMessage && <p className="error">{this.props.errorMessage}</p>}
      </div>
    );
  }
}
