import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Chat } from './Chat/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React/Node Chat</h1>
      </header>
      <Chat />
    </div>
  );
}

export default App;
