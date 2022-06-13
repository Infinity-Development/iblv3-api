const BotsStorage = require('@Models/models/bots');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/stats',
    {
      config: {
        rateLimit: {
          max: 3000,
          timeWindow: 900000,
          errorResponseBuilder: function (request, context) {
            return {
              code: 420,
              error: 'Enhance your Calm!',
              message: `Global Ratelimit: Max of ${this.max} Requests per 15 Minutes`,
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
              message: `Global Ratelimit: Max of ${this.max} Requests per 15 Minutes`,
              date: Date.now(),
              expiresIn: this.timeWindow,
            };
          },
        },
      },
    },
    async (req, res) => {
      res.header('Content-Type', 'application/json');

      let approved = await BotsStorage.find(
        { type: 'approved' },
        { _id: false },
      );
      let denied = await BotsStorage.find({ type: 'denied' }, { _id: false });
      let queued = await BotsStorage.find({ type: 'pending' }, { _id: false });

      res.status(200).send(
        JSON.stringify({
          approved_bots: approved.length,
          denied_bots: denied.length,
          bots_in_queue: queued.length,
        }),
      );
    },
  );
};
