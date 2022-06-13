const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/:userID',
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
      let user = await fetchSomeUser(req.params.userID);

      if (!user)
        return res.status(404).send({
          message: 'Unable to find a User in our System with the Provided ID',
          error: true,
          fatal: false,
          status: 404,
        });
      else if (user) {
        return res.status(200).send({
          nickname: user.nickname ? user.nickname : 'No nickname provided!',
          about: user.about
            ? user.about
            : 'This user prefers to remain Anonymous',
          certified_dev: user.certified ? user.certified : false,
          staff: user.staff ? user.staff : false,
          developer: user.developer ? user.developer : false,
          links: {
            website: user.website ? user.website : 'No website link provided!',
            github: user.github ? user.github : 'No github link provided!',
          },
        });
      } else {
        return res.status(400).send({
          message: 'Malformed Request: Please check the User ID and Try Again.',
          error: true,
          fatal: false,
          status: 400,
        });
      }
    },
  );
};
