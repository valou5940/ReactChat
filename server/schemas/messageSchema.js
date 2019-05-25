let mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  date: Date
});

module.exports = mongoose.model('message', messageSchema);
