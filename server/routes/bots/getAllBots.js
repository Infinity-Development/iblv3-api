const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const fetchAllBots = require('@Models/configs/fetchAllInfinityBots');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/all',
    {
      config: {
        rateLimit: {
          max: 3,
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
      res.header('Content-Type', 'application/json');

      Console.SendLogs(
        'Someone requested a list of all our Bots if this happens to often it may be Malicious',
        'event',
      );

      res.send(await fetchAllBots());
    },
  );
};
