const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { MessageEmbed } = require('discord.js');
const { fetchBotByToken } = require('@Models/configs/fetchBotByToken');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');

module.exports = async (fastify, opts) => {
  fastify.post(
    '/stats',
    {
      config: {
        rateLimit: {
          max: 100,
          timeWindow: 5000,
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
      let auth_header = req.headers.authorization;

      let bot = await fetchBotByToken(auth_header);

      let bot_data = await BotsStorage.findOne({ token: auth_header });

      if (!bot_data)
        return res.status(404).send({
          message:
            'Auth Token is Missing or Possibly invalid. Please verify your Token is correct using the "API Token" button on your Bots Page!',
          error: true,
          fatal: false,
          status: 404,
        });

      if (!bot)
        return res.status(404).send({
          message:
            'Unable to locate that Bot in our System. Please check the API Token and make sure it has been Approved!',
          error: true,
          fatal: false,
          status: 404,
        });

      if (bot.type === 'pending')
        return res.status(400).send({
          message:
            'Please wait until this Bot has been Approved before you Post Stats.',
          error: true,
          fatal: false,
          status: 400,
        });

      let servers = (await req.body.servers) ? req.body.servers : 0;
      let shards = (await req.body.shards) ? req.body.shards : 0;
      // let users = (await req.body.users) ? req.body.users : 0; // Coming Soon

      if (!auth_header)
        return res.status(400).send({
          message:
            'Authorization Token not found in the Request Header. Please provide a Infinity Bots API Token',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (!servers)
        return res.status(400).send({
          message:
            'Server Count not found in the Request Body or Server Count is Invalid. Count should be a Valid Integer',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (bot.token !== auth_header)
        return res.status(403).send({
          message:
            'Invalid Authorization Token has been provided. Please Check or Regenerate your API Token and Try Again!',
          error: true,
          fatal: false,
          status: 403,
        });
      else if (bot.token == 'None')
        return res.status(400).send({
          message:
            'No Auth Token has been found in our System for the Provided bot. Please Generate a new one and Try Again!',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (!parseInt(servers))
        return res.status(400).send({
          message:
            'Server Count is not a Valid Integer. Please correct your Server Count and Try Again',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (typeof shards != 'number')
        return res.status(400).send({
          message:
            'Shard Count is not a Valid Integer. Please correct your Shard Count and Try Again',
          error: true,
          fatal: false,
          status: 400,
        });
      else {
        try {
          bot.servers = servers;
          bot.shards = shards;
          //bot.users = users; // Coming soon

          await bot.save();

          Console.SendLogs(
            `Stats have been posted for: ${bot.botName} successfully!`,
            'router',
          );

          return res.status(200).send({
            message:
              'Success, Your stats have been posted to Infinity Bot List! Now go do something productive and enjoy your day xD',
            error: false,
            fatal: false,
            status: 200,
          });
        } catch (err) {
          let error_private = new MessageEmbed()
            .setAuthor({
              name: 'Internal Server Error',
              iconURL:
                'https://cdn.discordapp.com/attachments/653733403841134600/906287522068439080/imageedit_3_3710163012.png',
            })
            .setColor('RED')
            .setDescription(`Error Message: ${err}`)
            .addField('Triggered On:', '``/bots/stats``')
            .addField(
              'Note:',
              'Please check the Server Logs for a Full Error Stack.',
            )
            .setTimestamp()
            .setFooter({ text: '© Copyright 2020-2022 - Infinity Bot List' });

          await sendErrorMessage({ embeds: [error_private] });

          await Console.SendLogs(`${err.stack}`, 'error');

          return res.status(500).send({
            message: 'Internal Server Error: Our Dev Team has been notified!',
            error: true,
            fatal: false,
            status: 500,
          });
        }
      }
    },
  );
};
