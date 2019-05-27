const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');
const port = process.env.PORT || 5000;
const MessageModel = require('./schemas/messageSchema');
const UserModel = require('./schemas/userSchema');
const database = require('./database/database');
const bodyParser = require('body-parser');
// const rc = io.of('/room-choice');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use middleware to set the default Content-Type
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});
// app.use(express.cookieParser());
// app.use(express.session({ secret: 'cool beans' }));
// app.use(express.methodOverride());
app.use(allowCrossDomain);
// app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/chat/public/index.html`);
});

// app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build/index.html'));
// });

let channels = [];

// get full userlists
app.get('/users', (req, res) => {
  getFullUsersList()
    .then(users => {
      console.log('Full users list', users);
      res.json({ users: users });
    })
    .catch(error => {
      res.json(error);
    });
});

// save user into db
app.post('/user', (req, res) => {
  console.log(req.body.nickname);
  setNicknameOnLogin(req.body.nickname)
    .then(user => {
      console.log('USER TO SEND TO CLIENT : ', user);
      res.json({ user: user });
    })
    .catch(error => {
      res.json(error);
    });
});

// send channels list to client
app.get('/rooms', (req, res) => {
  res.json({ channels: channels });
});

let messages = [];
let room;
// when connecting to room-choice event
io.on('connection', socket => {
  socket.join('home-room');
  let currentUser;

  //connect to database
  database.connection;

  // create channel
  socket.on('create-channel', usersAndChannel => {
    socket.leave('home-room');
    room = usersAndChannel.channelName;
    channels = [...channels, room];
    socket.join(room);
    console.log(usersAndChannel);
    changeUserChannel(usersAndChannel.self, room);
  });

  // when user joining channels list, add this user to every clients
  socket.on('user-joining-channel', user => {
    currentUser = user;
    io.emit('user-choosing-channel', user);
  });

  socket.on('join-channel', userAndChannel => {
    room = userAndChannel.channelName;
    changeUserChannel(userAndChannel.user, room);
    console.log(room);
    // fetch all users on the channel and emit it to the room
    getUsersInChannel(room)
      .then(users => {
        socket.join(room);
        console.log('USER LIST IN CHANNEL ', users);
        io.to(room).emit('users-list', users);
        io.to(room).emit('user-joined', userAndChannel.user);
      })
      .catch(error => {
        console.log(error);
      });

    getMessagesInChannel(room).then(messages => {
      io.to(room).emit('dispatch-messages', messages);
    });
    console.log('user joining ', userAndChannel.user);
  });

  // socket.on('users-list', users => {
  //   socket.to(room).emit('users-list', users);
  // });

  socket.on('send-message', message => {
    let messageToDispatch = message;

    let messageToDb = new MessageModel({
      user: message.user,
      text: message.text,
      date: message.date,
      channel: room
    });

    console.log(messageToDb);
    messageToDb
      .save()
      .then(doc => {
        console.log(doc);
      })
      .catch(err => {
        console.log(err);
      });

    // messages = [...messages, messageToDispatch];
    io.to(room).emit('dispatch-message', messageToDispatch);
    // if (messages.length > 30) {
    //   setTimeout(() => {
    //     messages = messages.slice(20, 30);
    //     io.emit('dispatch-messages', messages);
    //   }, 5000);
    // }
  });

  // if (usersList.find(user => user.nickname === currentUser && user.logged === true)) {
  //   console.log('user already exist');
  // } else if
  //  (usersList.find(user => user.nickname === currentUser && user.logged === false)) {

  // } else {
  //   const addUser = new UserModel({ nickname: currentUser, logged: true });
  //   addUser
  //     .save()
  //     .then(user => {
  //       console.log(user);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }
  // if ()
  // let user = ;
  // users = [...users, { nickname: nickname, isWriting: false }];
  // io.emit('user-connected', nickname);
  // io.emit('users-list', users);
  // io.emit('dispatch-messages', messages);

  // socket.on('is-writing', userState => {
  //   users.map(user => {
  //     if (user.nickname === userState.nickname) {
  //       user.isWriting = userState.isWriting;
  //     }
  //   });
  //   io.emit('users-list', users);
  // });

  // socket.on('switch-conversation', users => {
  //   socket.leave(room);
  //   room = `${users.self}${users.user}-room`;
  //   socket.broadcast.emit('join-conversation', users.user);
  //   socket.join(room);
  // });

  socket.on('disconnect', () => {
    // if (currentUser !== null && currentUser !== undefined) {
    //   users = users.filter(user => user.nickname !== currentUser);
    //   io.emit('user-disconnected', currentUser);
    //   console.log(currentUser + ' disconnected');
    // }
    // if (users.length > 0) {
    //   io.emit('users-list', users);
    // }

    // delete user from database when disconnects
    deleteConnectedUser(currentUser)
      .then(user => {
        console.log('user left ?', user);
        io.emit('user-left', user);
        io.to(room).emit('user-disconnected', user);
        // currentUser = null;
      })
      .then(() => {
        getUsersInChannel(room).then(users => {
          io.to(room).emit('users-list', users);
        });
      })
      .catch(error => {
        handleError(error);
      });
  });
});

/*
 * on new user login, check if nickname is available
 */
setNicknameOnLogin = nickname => {
  let userExist;
  // currentUser = nickname;

  return new Promise((resolve, reject) => {
    UserModel.model
      .find({ nickname: nickname })
      .then(user => {
        console.log('USER IN DATABASE :', user);
        userExist = user;

        if (userExist.length === 0) {
          const saveUser = new UserModel.model({ nickname: nickname, channel: '' });
          saveUser.save((err, user) => {
            if (err) {
              console.log(err);
              return handleError(err);
            }
            console.log('user saved', user);
            userExist = user;
            resolve(userExist);
          });
        } else {
          reject('Nickname is already taken !');
        }
      })
      .catch(error => {
        return handleError(error);
      });
  });
};

/*
 * get full users list
 */
getFullUsersList = () => {
  return new Promise((resolve, reject) => {
    UserModel.model
      .find({})
      .then(users => {
        if (users !== undefined) {
          resolve(users);
        } else {
          reject('No users connected');
        }
      })
      .catch(error => {
        return handleError(error);
      });
  });
};

/*
 * delete user from database
 */
deleteConnectedUser = user => {
  // const userLeft = nickname;
  console.log('user to delete', user);
  return new Promise((resolve, reject) => {
    UserModel.model
      .findOneAndDelete({ nickname: user.nickname })
      .then(userLeft => {
        console.log(`user ${userLeft} removed`);
        if (userLeft !== undefined) {
          resolve(userLeft);
        } else {
          reject("User does'nt exist");
        }
      })
      .catch(error => {
        return handleError(error);
      });
  });
};

/*
 * Change user channel when joining/creating new channel
 */
changeUserChannel = (user, room) => {
  UserModel.model
    .findOneAndUpdate({ nickname: user.nickname }, { channel: room })
    .then(user => {
      console.log(user);
    })
    .catch(error => {
      console.log(error);
    });
};

/*
 * get users list on the channel
 */

getUsersInChannel = room => {
  return new Promise((resolve, reject) => {
    UserModel.model
      .find({ channel: room })
      .then(users => {
        console.log(users);
        if (users !== undefined) {
          resolve(users);
        } else {
          reject('No Users');
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};

getMessagesInChannel = room => {
  return new Promise((resolve, reject) => {
    MessageModel.find({ channel: room }).then(messages => {
      if (messages !== undefined) {
        console.log(messages);
        resolve(messages);
      } else {
        reject('No Messages');
      }
    });
  });
};
server.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
