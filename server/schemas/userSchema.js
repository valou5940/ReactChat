let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: { type: String, index: true, unique: true },
  channel: String
});
module.exports = { userSchema: userSchema, model: mongoose.model('users', userSchema) };
