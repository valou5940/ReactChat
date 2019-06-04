const socketIo = require('socket.io');
const database = require('../database/database');
const UserController = require('../controllers/UsersController');

class Sockets {
  constructor() {
    this.connectSocket();
  }

  //   crossDomain(allowCrossDomain) {
  //     app.use(allowCrossDomain)
  //   }

  connectSocket(server) {
    let io = socketIo(server);
    // when connecting
    io.on('connection', socket => {
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
        // currentUser = user;
        socket.user = user;
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

      socket.on('user-disconnects', nickname => {
        // currentUser['disconnected'] = true;
        // delete user from database when disconnects
        // setTimeout(function() {
        //   if (currentUser['disconnected']) {
        UserController.deleteConnectedUser(nickname)
          .then(user => {
            const room = user.channel.channelName;
            console.log('user left ?', user);
            io.emit('user-left', user);
            io.to(room).emit('user-disconnected', user);
            getUsersInChannel(room).then(users => {
              io.to(room).emit('users-list', users);
            });
            // currentUser = null;
          })
          .catch(error => {
            console.log(error);
          });
        // }
        // }, 10000);
      });
    });
  }
}

module.exports = new Sockets();
