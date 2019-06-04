import React from 'react';
import './App.css';
import { Chat } from './Chat/Chat';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { Connection } from './Connection/Connection';
import { Rooms } from './Rooms/Rooms';
import socketIOClient from 'socket.io-client';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient.connect(
        process.env.REACT_APP_NAPICHAT_URL || 'http://localhost:5000',
        { forceNew: true }
      ),
      login: ''
    };
    // this.state.socket.emit('register', localStorage.getItem('userUniqueUID'));
  }

  componentDidMount() {}

  getLogin(login) {
    this.setState({
      login: login
    });
  }

  componentWillUnmount() {
    this.state.socket.emit('user-disconnects', this.state.login);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>NaPi Chat</h1>
        </header>
        <Router>
          <div>
            <Route
              exact
              path="/"
              render={props => <Connection {...props} onLogin={this.getLogin.bind(this)} />}
            />
            <Route
              path="/rooms"
              render={props => {
                if (this.state.login !== '') {
                  return <Rooms {...props} socket={this.state.socket} />;
                } else {
                  // return <Connection {...props} onLogin={this.getLogin.bind(this)} />;
                  return <Redirect to="/" />;
                }
              }}
            />
            <Route
              path="/chat"
              render={props => {
                if (this.state.login !== '') {
                  return <Chat {...props} socket={this.state.socket} />;
                } else {
                  // return <Connection {...props} onLogin={this.getLogin.bind(this)} />;
                  return <Redirect to="/" />;
                }
              }}
            />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
