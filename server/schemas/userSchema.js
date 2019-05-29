let mongoose = require('mongoose');
let channel = require('./channelSchema');

const userSchema = new mongoose.Schema({
  nickname: { type: String, index: true, unique: true },
  channel: { type: channel.channelSchema }
});
module.exports = { userSchema: userSchema, model: mongoose.model('users', userSchema) };
