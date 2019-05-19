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
let messages = [];
index = 1;
io.on('connection', socket => {
  let currentUser;
  // socket.emit('user connected');

  socket.on('send-message', message => {
    let messageToDispatch = { index: index, message: message.message, user: currentUser };
    messages = [...messages, messageToDispatch];
    io.emit('dispatch-message', messageToDispatch);
    index += 1;
  });

  socket.on('login', user => {
    // io.emit('user-connection', user);
    currentUser = user;
    users = [...users, user];
    io.emit('user-connected', `${user} connected`);
    io.emit('users-list', users);
    io.emit('dispatch-messages', messages);
  });

  socket.on('disconnect', () => {
    if (users.indexOf(currentUser) !== -1) {
      users.splice(users.indexOf(currentUser), 1);
    }
    io.emit('user-disconnected', `${currentUser} disconnected`);
    console.log(currentUser + ' disconnected');
    if (users.length > 0) {
      io.emit('users-list', users);
    }
  });
});

server.listen(3001, () => {
  console.log('server listening to port 3000');
});
