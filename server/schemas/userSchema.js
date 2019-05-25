let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: { type: String, index: true, unique: true }
});
module.exports = mongoose.model('users', userSchema);
