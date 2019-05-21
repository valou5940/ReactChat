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
  socket.emit('users-list', users);

  socket.on('send-message', message => {
    let messageToDispatch = { index: index, message: message.message, user: currentUser };
    messages = [...messages, messageToDispatch];
    io.emit('dispatch-message', messageToDispatch);
    index += 1;
    if (messages.length > 30) {
      setTimeout(() => {
        messages = messages.slice(20, 30);
        index = 21;
        io.emit('dispatch-messages', messages);
      }, 5000);
    }
  });

  socket.on('login', nickname => {
    currentUser = nickname;
    // let user = ;
    users = [...users, { nickname: nickname, isWriting: false }];
    io.emit('user-connected', nickname);
    io.emit('users-list', users);
    io.emit('dispatch-messages', messages);
  });

  socket.on('is-writing', userState => {
    users.map(user => {
      if (user.nickname === userState.nickname) {
        user.isWriting = userState.isWriting;
      }
    });
    io.emit('users-list', users);
  });

  socket.on('disconnect', () => {
    // if (users.indexOf(currentUser) !== -1) {
    //   users.splice(users.indexOf(currentUser), 1);
    // }
    if (currentUser !== null && currentUser !== undefined) {
      users = users.filter(user => user.nickname !== currentUser);
      io.emit('user-disconnected', currentUser);
      console.log(currentUser + ' disconnected');
    }
    if (users.length > 0) {
      io.emit('users-list', users);
    }
  });
});

server.listen(3001, () => {
  console.log('server listening to port 3000');
});
