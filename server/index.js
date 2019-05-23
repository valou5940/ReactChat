const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/chat/public/index.html`);
// });
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

let users = [];
let messages = [];
let index = 1;
// let room = 'main-room';
io.on('connection', socket => {
  let currentUser;
  // socket.join(room);
  socket.emit('users-list', users);

  socket.on('send-message', message => {
    let messageToDispatch = {
      index: index,
      text: message.text,
      date: message.date,
      user: currentUser
    };
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

  // socket.on('switch-conversation', users => {
  //   socket.leave(room);
  //   room = `${users.self}${users.user}-room`;
  //   socket.broadcast.emit('join-conversation', users.user);
  //   socket.join(room);
  // });

  socket.on('disconnect', () => {
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

server.listen(process.env.port || 3000, () => {
  console.log('server listening to port 3000');
});
