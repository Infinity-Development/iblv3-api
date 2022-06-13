const { Schema, model } = require('mongoose');

module.exports = model(
  'users',
  new Schema({
    userID: { type: String, default: '00000000000000' },
    votes: { type: Map, of: String, default: {} },
    pack_votes: { type: Map, of: String, default: {} },
    staff: { type: Boolean, default: false },
    certified: { type: Boolean, default: false },
    developer: { type: Boolean, default: false },
    website: { type: String, default: 'https://infinitybots.xyz' },
    github: { type: String, default: 'https://github.com/' },
    nickname: { type: String, default: 'none' },
    about: { type: String, default: 'I am a very mysterious person' },
    vote_banned: { type: Boolean, default: false },
    staff_stats: {
      type: Map,
      default: { approved_bots: 0, denied_bots: 0, certified_bots: 0 },
    },
    new_staff_stats: {
      type: Map,
      default: { approved_bots: 0, denied_bots: 0, certified_bots: 0 },
    },
  }),
);
