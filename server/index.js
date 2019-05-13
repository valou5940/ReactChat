const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/chat/public/index.html`);
});

io.on('connection', socket => {
  let users = [];

  socket.emit('user connected');

  socket.on('chatMessage', message => {
    io.emit('chatMessage', message);
  });

  socket.on('login', user => {
    users = [...users, user];
    io.emit('login', users);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

server.listen(3001, () => {
  console.log('server listening to port 3000');
});
