const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { voteBanUser } = require('@Models/configs/voteBanUser');
const Console = require('@Handlers/logger/index');
const { MessageEmbed } = require('discord.js');
const config = require('@Configs/index');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/vb/user/:userID',
    {
      config: {
        rateLimit: {
          max: 2,
          timeWindow: 3600000,
          errorResponseBuilder: function (request, context) {
            return {
              code: 420,
              error: 'Enhance your Calm!',
              message: `Ratelimit: Max of ${this.max} Requests per 1 Hour`,
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
              message: `Ratelimit: Max of ${this.max} Requests per 1 Hour`,
              date: Date.now(),
              expiresIn: this.timeWindow,
            };
          },
        },
      },
    },
    async (req, res) => {
      let auth_header = req.headers.authorization || req.headers.Authorization;

      let user = await fetchSomeUser(req.params.userID);

      if (!auth_header)
        return res.status(400).send({
          message:
            'No Auth Header provided. Please provide the Infinity Staff Token.',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (auth_header !== config.staff.auth)
        return res.status(401).send({
          message: 'You are not authorized to interact with this Endpoint!',
          error: true,
          fatal: false,
          status: 401,
        });
      else if (!user)
        return res.status(404).send({
          message: 'Unable to find a User with the Provided ID in our System!',
          error: true,
          fatal: false,
          status: 404,
        });
      else if (user.staff)
        return res.status(400).send({
          message:
            'What kind of trickery is this. You can not Vote Ban any member of our Staff Team!',
          error: true,
          fatal: false,
          status: 400,
        });
      else {
        try {
          await voteBanUser(req.params.userID);

          return res.status(200).send({
            message: 'Okay, that user has been Vote Banned Successfully!',
            error: false,
            fatal: false,
            status: 200,
          });
        } catch (err) {
          let private_error = new MessageEmbed()
            .setAuthor({ name: 'Internal Server Error' })
            .setColor('RED')
            .setDescription(`Error: ${err}`)
            .addField(
              'NOTE:',
              'Please check the Server Logs for a Full Error Stack',
            )
            .setTimestamp()
            .setFooter({ text: client.footer });

          await sendErrorMessage({ embeds: [private_error] });

          await Console.SendLogs(`${err.stack}`, 'error');

          return res.status(500).send({
            message:
              'Something went wrong here! Our Dev Team has been Notified!',
            error: true,
            fatal: false,
            status: 500,
          });
        }
      }
    },
  );
};
