let mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  channelName: String
});
module.exports = { channelSchema: channelSchema, model: mongoose.model('channel', channelSchema) };
