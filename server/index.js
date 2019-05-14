const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/chat/public/index.html`);
});

let users = [];
io.on('connection', socket => {
  let currentUser;
  socket.emit('user connected');

  socket.on('chatMessage', message => {
    io.emit('chatMessage', message);
  });

  socket.on('login', user => {
    // io.emit('user-connection', user);
    currentUser = user;
    users = [...users, user];
    io.emit('users-list', users);
  });

  socket.on('disconnect', () => {
    if (users.indexOf(currentUser) !== -1) {
      users.splice(users.indexOf(currentUser), 1);
    }
    console.log(currentUser + ' disconnected');
    io.emit('users-list', users);
  });
});

server.listen(3001, () => {
  console.log('server listening to port 3000');
});
