const { Schema, model } = require('mongoose');

module.exports = model(
  'reviews',
  new Schema({
    botID: { type: String, default: '00000000000000' },
    author: { type: String, default: '0000' },
    content: { type: String, default: 'Good bot!' },
    rate: { type: Boolean, default: true },
    star_rate: { type: Number, default: 1 },
    likes: { type: Map, of: String, default: {} },
    dislikes: { type: Map, of: String, default: {} },
    date: { type: Number, default: Date.now() },
    edited: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false },
    replies: { type: Map, of: String, default: {} },
  }),
);
