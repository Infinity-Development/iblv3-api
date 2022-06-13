const { Schema, model } = require('mongoose');

module.exports = model(
  'votes',
  new Schema({
    userID: String,
    botID: String,
    date: Number,
  }),
);
