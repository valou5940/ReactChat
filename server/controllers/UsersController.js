const UserModel = require('../schemas/userSchema');
const ChannelModel = require('../schemas/channelSchema');

class UserController {
  constructor() {
    // this.getFullUsersList();
  }
  /*
   * get full users list
   */
  getFullUsersList() {
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
  }

  /*
   * on new user login, check if nickname is available
   */
  setNicknameOnLogin(nickname) {
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
  }

  /*
   * Change user channel when joining/creating new channel
   */
  changeUserChannel(user, channelName) {
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
  }

  /*
   * get users list on the channel
   */
  getUsersInChannel(room) {
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
  }

  /*
   * delete user from database
   */
  deleteConnectedUser(nickname) {
    // const userLeft = nickname;
    console.log('user to delete', nickname);
    return new Promise((resolve, reject) => {
      UserModel.model
        .findOneAndDelete({ nickname: nickname })
        .then(userLeft => {
          console.log(`user ${userLeft} removed`);
          resolve(userLeft);
        })
        .catch(error => {
          reject("User does'nt exist", error);
        });
    });
  }
}

module.exports = new UserController();
