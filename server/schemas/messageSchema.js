let mongoose = require('mongoose');
let user = require('./userSchema');
// let ObjectId = mongoose.Schema.Types.ObjectId;
const messageSchema = new mongoose.Schema({
  user: user.userSchema,
  text: String,
  date: Date,
  channel: String
});

module.exports = mongoose.model('message', messageSchema);
