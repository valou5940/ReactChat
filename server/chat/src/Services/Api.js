export default class Api {
  //login
  login(nickname) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: 'post',
        body: JSON.stringify({ nickname: nickname }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          resolve(data.user);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // get user list in channel
  getChannelUserList(room) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/users/${room}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log('USERS FETCHED', data.users);
          resolve(data.users);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // get messages list in channel
  getChannelMessagesList(room) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/messages/${room}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log('MESSAGES FETCHED', data.messages);
          resolve(data.messages);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // get full user list
  getFullUsersList() {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          if (data.users.length !== 0) {
            resolve(data.users);
          }
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // set user's channel
  setUserChannel(user, channel) {
    console.log('user ', user);
    console.log('channel : ', channel);
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/user/channel`, {
        method: 'post',
        body: JSON.stringify({ user: user, channel: channel }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log('USER FETCHED', data);
          resolve(data.user);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  //get full channel list
  getChannelsList() {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/rooms`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          if (data.channels.length > 0) {
            resolve(data.channels);
          }
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }
}
