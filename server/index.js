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

let messages = [];

io.on('connection', socket => {
  let currentUser;
  database.connection;

  // socket.join(room);
  // socket.emit('users-list', users);

  socket.on('send-message', message => {
    let messageToDispatch = {
      text: message.text,
      date: message.date,
      user: currentUser
    };

    let messageToDb = new MessageModel({
      user: currentUser,
      text: message.text,
      date: message.date
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

    messages = [...messages, messageToDispatch];
    io.emit('dispatch-message', messageToDispatch);
    if (messages.length > 30) {
      setTimeout(() => {
        messages = messages.slice(20, 30);
        io.emit('dispatch-messages', messages);
      }, 5000);
    }
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
    //   if (currentUser !== null && currentUser !== undefined) {
    //     users = users.filter(user => user.nickname !== currentUser);
    //     io.emit('user-disconnected', currentUser);
    //     console.log(currentUser + ' disconnected');
    //   }
    //   if (users.length > 0) {
    //     io.emit('users-list', users);
    //   }
  });
});

/*
 * on new user login, check if nickname is available
 */
setNicknameOnLogin = nickname => {
  let userExist;
  currentUser = nickname;

  return new Promise((resolve, reject) => {
    UserModel.find({ nickname: nickname })
      .then(user => {
        console.log('USER IN DATABASE :', user);
        userExist = user;

        if (userExist.length === 0) {
          const saveUser = new UserModel({ nickname: nickname });
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

getFullUsersList = () => {
  return new Promise((resolve, reject) => {
    UserModel.find({})
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

server.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
