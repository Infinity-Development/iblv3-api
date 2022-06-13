const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/staff/user/:userID',
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

      let user = await fetchSomeUser(req.params.userID);
      let cache_user = await req.client.users.fetch(user.userID);

      if (!user)
        return res.status(404).send(
          JSON.stringify({
            message:
              'Seems like we are unable to find that User in our System! Please check the User ID and Try Again!',
            error: true,
            fatal: false,
            status: 404,
          }),
        );

      return res.status(200).send(
        JSON.stringify({
          userID: user.userID,
          userName: cache_user.username,
          is_staff: user.staff ? true : false,
        }),
      );
    },
  );
};
