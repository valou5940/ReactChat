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
const ChannelModel = require('./schemas/channelSchema');
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

//change user channel
app.post('/user/channel', (req, res) => {
  const user = req.body.user;
  const channel = req.body.channel;
  changeUserChannel(user, channel)
    .then(user => {
      res.json({ user: user });
    })
    .catch(error => {
      res.json(error);
    });
});

app.get('/users/:channel', (req, res) => {
  const room = req.params.channel;
  getUsersInChannel(room)
    .then(users => {
      res.json({ users: users });
    })
    .catch(error => {
      res.json(error);
    });
});

app.get('/messages/:channel', (req, res) => {
  const room = req.params.channel;
  getMessagesInChannel(room)
    .then(messages => {
      res.json({ messages: messages });
    })
    .catch(error => {
      res.json(error);
    });
});

// send channels list to client
app.get('/rooms', (req, res) => {
  getChannels()
    .then(channels => {
      res.json({ channels: channels });
    })
    .catch(error => {
      res.json(error);
    });
});

app.get('/messages/:channel');
// when connecting
io.on('connection', socket => {
  socket.join('home-room');

  let currentUser;

  //connect to database
  database.connection;

  // create channel
  socket.on('create-channel', usersAndChannel => {
    socket.leave('home-room');
    const room = usersAndChannel.channelName;
    saveChannel(room);
    socket.join(room);
    console.log(usersAndChannel);
  });

  // when user joining channels list, add this user to every clients
  socket.on('user-joining-channel', user => {
    currentUser = user;
    io.emit('user-choosing-channel', user);
  });

  socket.on('join-channel', user => {
    socket.leave('home-room');
    const room = user.channel.channelName;
    console.log('ROOM VALUE : ', room);
    socket.join(room);
    // console.log('USER LIST IN CHANNEL ', users);
    // io.to(room).emit('users-list', users);
    io.to(room).emit('user-joined', user);
    // fetch all users on the channel and emit it to the room
    // getUsersInChannel(room)
    //   .then(users => {

    //   })
    //   .then(() => {
    //     getMessagesInChannel(room).then(messages => {
    //       io.to(room).emit('dispatch-messages', messages);
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  });

  socket.on('send-message', message => {
    console.log('MESSAGE TO BROADCAST ', message);
    const room = message.user.channel.channelName;
    const messageToDispatch = message;
    saveMessage(message);
    console.log('room to send message :', room);
    io.to(room).emit('dispatch-message', messageToDispatch);
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
    // delete user from database when disconnects
    deleteConnectedUser(currentUser)
      .then(user => {
        const room = user.channel.channelName;
        console.log('user left ?', user);
        io.emit('user-left', user);
        io.to(room).emit('user-disconnected', user);
        database.connection.close();
        // currentUser = null;
      })
      .then(() => {
        getUsersInChannel(room).then(users => {
          io.to(room).emit('users-list', users);
        });
      })
      .catch(error => {
        console.log(error);
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
          const channelModel = new ChannelModel.model({ channelName: 'default-channel' });
          const saveUser = new UserModel.model({
            nickname: nickname,
            channel: channelModel
          });
          saveUser.save((err, user) => {
            if (err) {
              console.log(err);
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
        console.log(error);
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
        console.log(error);
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
        resolve(userLeft);
      })
      .catch(error => {
        reject("User does'nt exist", error);
      });
  });
};

/*
 * Change user channel when joining/creating new channel
 */
changeUserChannel = (user, channelName) => {
  console.log('CHANNEL NAME :', channelName);
  console.log('user name', user.nickname);
  return new Promise((resolve, reject) => {
    const channelModel = new ChannelModel.model({ channelName: channelName });
    UserModel.model
      .findOneAndUpdate(
        { nickname: user.nickname },
        { $set: { channel: channelModel } },
        { new: true }
      )
      .then(user => {
        console.log(user);
        resolve(user);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

/*
 * get users list on the channel
 */

getUsersInChannel = room => {
  return new Promise((resolve, reject) => {
    UserModel.model
      .find({ 'channel.channelName': room })
      .then(users => {
        console.log('USER in channel', users);
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

// get messages list in selected channel
getMessagesInChannel = room => {
  return new Promise((resolve, reject) => {
    MessageModel.find({ 'user.channel.channelName': room }).then(messages => {
      if (messages !== undefined) {
        console.log('MESSAGES IN CHANNEL ', messages);
        resolve(messages);
      } else {
        reject('No Messages');
      }
    });
  });
};

//get channels list
getChannels = () => {
  return new Promise((resolve, reject) => {
    ChannelModel.model
      .find()
      .then(channels => {
        if (channels !== undefined) {
          resolve(channels);
        } else {
          reject('No channels !');
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};

// put message into database
saveMessage = message => {
  // let channel = new ChannelModel.model({channelName: message.use})
  let messageToDb = new MessageModel({
    user: message.user,
    text: message.text,
    date: message.date
  });

  messageToDb
    .save()
    .then(doc => {
      console.log(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

// put new channel into database
saveChannel = room => {
  const channelToSave = new ChannelModel.model({
    channelName: room
  });

  channelToSave
    .save()
    .then(channel => {
      console.log(channel);
    })
    .catch(error => {
      console.log(error);
    });
};

server.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
