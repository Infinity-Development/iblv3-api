const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { fetchApprovedBots } = require('@Models/configs/fetchApprovedBot');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { checkUserVoted } = require('@Models/configs/checkUserVoted');
const moment = require('moment');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/:botID/:userID',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: 900000,
          errorResponseBuilder: function (request, context) {
            return {
              code: 420,
              error: 'Enhance your Calm!',
              message: `Ratelimit: Max of ${this.max} Requests per 15 Minutes`,
              date: Date.now(),
              expiresIn: this.timeWindow,
            };
          },
          onExceeding: function (request, context) {
            return {
              code: 429,
              error: 'Woah, Slow down chief',
              message: `You are making to many requests to quickly and will soon be Rate Limited!`,
              date: Date.now(),
              expiresIn: this.timeWindow,
            };
          },
          onExceeded: function (request, context) {
            return {
              code: 420,
              error: 'Enhance your Calm!',
              message: `Ratelimit: Max of ${this.max} Requests per 15 Minutes`,
              date: Date.now(),
              expiresIn: this.timeWindow,
            };
          },
        },
      },
    },
    async (req, res) => {
      let client = req.client;

      res.header('Content-Type', 'application/json');

      let bot = await fetchApprovedBots(req.params.botID);
      let user = await fetchSomeUser(req.params.userID);

      if (!bot)
        return res.status(404).send({
          message:
            'Unable to find a bot with that ID in our System. Please check the ID and make sure it has been Approved!',
          error: true,
          fatal: false,
          status: 404,
        });

      if (!user)
        return res.status(404).send({
          message:
            'Unable to find a user with that ID in our System. This most likely means they have Never voted for this Bot!',
          error: true,
          fatal: false,
          status: 404,
        });

      let check_bot_votes = await checkUserVoted({
        bot: req.params.botID,
        user: req.params.userID,
      });

      if (!check_bot_votes)
        return res.status(404).send({
          message:
            'Unable to find any Votes from the User for the Bot Provided! This definitely means they have Never voted for this Bot!',
          error: true,
          fatal: false,
          status: 404,
        });
      else {
        let voted;

        let hours = await moment().diff(moment(check_bot_votes.date), 'hours');

        if (hours < 6) {
          voted = true;
        } else if (hours > 6) {
          voted = false;
        }

        return res.status(200).send({
          hasVoted: voted ? true : false,
        });
      }
    },
  );
};
