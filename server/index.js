const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const path = require('path');
const port = process.env.PORT || 3000;

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/chat/public/index.html`);
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let users = [];
let messages = [];
io.on('connection', socket => {
  let currentUser;
  // socket.emit('user connected');

  socket.on('send-message', message => {
    let messageToDispatch = { message: message, user: currentUser };
    messages = [...messages, messageToDispatch];
    io.emit('dispatch-message', messageToDispatch);
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

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
