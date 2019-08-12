const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _id: {
    type: Object,
    require: true,
  },
  expires: {
    type: Date,
    require: true,
  },
  session: {
    type: String,
    require: true,
  },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
