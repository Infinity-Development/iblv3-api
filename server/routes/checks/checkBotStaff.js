const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/staff/bot/:botID',
    {
      config: {
        rateLimit: {
          max: 1,
          timeWindow: 3600000,
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
      res.header('Content-Type', 'application/json');

      let bot = await fetchSomeBot(req.params.botID);

      if (!bot)
        return res.status(404).send(
          JSON.stringify({
            message:
              'Seems like we are unable to find that Bot in our System! Please check the Bot ID and Try Again!',
            error: true,
            fatal: false,
            status: 404,
          }),
        );

      return res.status(200).send(
        JSON.stringify({
          botID: bot.botID,
          botName: bot.botName,
          is_staff: bot.staff ? true : false,
        }),
      );
    },
  );
};
