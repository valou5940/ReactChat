import React from 'react';
import './App.css';
import { Chat } from './Chat/Chat';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Connection } from './Connection/Connection';
import { Rooms } from './Rooms/Rooms';
import socketIOClient from 'socket.io-client';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: ''
    };
  }

  componentDidMount() {
    this.setState({
      socket: socketIOClient('http://localhost:5000')
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>NaPi Chat</h1>
        </header>
        <Router>
          <div>
            <Route exact path="/" component={Connection} />
            <Route
              path="/rooms"
              render={props => <Rooms {...props} socket={this.state.socket} />}
            />
            <Route path="/chat" render={props => <Chat {...props} socket={this.state.socket} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
