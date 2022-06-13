const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const fetchAllBots = require('@Models/configs/fetchAllInfinityBots');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/custom',
    {
      config: {
        rateLimit: {
          max: 2,
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
      let client = req.client;

      request(req.body.custom_webhook, {
        method: POST,
        headers: {
          Authorization: req.body.auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'TEST',
          userID: 'TEST',
          botID: 'TEST',
          timeStamp: Date.now(),
        }),
      })
        .then(() => {
          res.json({
            message:
              "We've successfully sent a TEST request to the Webhook Provided",
          });
        })
        .catch(async (err) => {
          return res.json({
            message:
              'Hmm, We were unable to send a request to that Webhook URL. Please make sure the link is a URL format!',
          });
        });
    },
  );
};
