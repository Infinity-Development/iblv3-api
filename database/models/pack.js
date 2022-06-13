const { Schema, model } = require('mongoose');

module.exports = model(
  'packages',
  new Schema({
    name: { type: String, default: 'none' },
    short: { type: String, default: 'No short description' },
    votes: { type: Number, default: 0 },
    tags: { type: String, default: 'none' },
    url: { type: String, default: 'none' },
    owner: { type: String, default: 'none' },
    date: { type: Number, default: Date.now() },
    bots: { type: Array, default: [] },
  }),
);
