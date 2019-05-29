let mongoose = require('mongoose');
let user = require('./userSchema');
let channel = require('./channelSchema');

// let ObjectId = mongoose.Schema.Types.ObjectId;
const messageSchema = new mongoose.Schema({
  user: user.userSchema,
  text: String,
  date: Date
});

module.exports = mongoose.model('message', messageSchema);
