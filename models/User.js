const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    required: true,
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
