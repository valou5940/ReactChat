import React from 'react';
import './App.css';
import { Chat } from './Chat/Chat';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Connection } from './Connection/Connection';
import { Rooms } from './Rooms/Rooms';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>NaPi Chat</h1>
      </header>
      <Router>
        <div>
          <Route exact path="/" component={Connection} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/chat" component={Chat} />
        </div>
      </Router>
    </div>
  );
}

export default App;
