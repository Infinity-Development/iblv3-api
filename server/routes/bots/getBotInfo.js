const Console = require('@Handlers/logger/index');
const BotsStorage = require('@Models/models/bots');
const { fetchApprovedBots } = require('@Models/configs/fetchApprovedBot');
const { fetchCertifiedBot } = require('@Models/configs/fetchCertifiedBot');

module.exports = async (fastify, opts) => {
  fastify.get('/:botID', async (req, res) => {
      res.header('Content-Type', 'application/json');

      let client = req.client;

      let bot = await fetchApprovedBots(req.params.botID);

      if (!bot) bot = await fetchCertifiedBot(req.params.botID);

      if (!bot)
        return res.status(404).send({
          message:
            'Unable to find that Bot in our System. Please make sure it has been Approved?',
          error: true,
          fatal: false,
          status: 404,
        });

      if (bot.type === 'pending')
        return res.status(400).send({
          message:
            'Woah, Please wait until this bot has been Approved before attempting to Access it on our API',
          error: true,
          fatal: false,
          status: 400,
        });
      else if (bot) {
        let add;

        if (bot.additional_owners.length < 1) {
          add = 'No Additional Owners to Fetch!';
        } else {
          add = bot.additional_owners;
        }
        
        let fetch = await client.users.fetch(bot.botID).catch(() => {});

        return res.status(200).send({
          name: bot.botName,
          avatar: fetch.displayAvatarURL() || 'https://cdn.discordapp.com/attachments/653733403841134600/976642199460659210/defaultUser.webp',
          botID: bot.botID,
          tags: bot.tags,
          prefix: bot.prefix,
          owner: client.users.cache.get(bot.main_owner)
            ? client.users.cache.get(bot.main_owner).username
            : bot.main_owner,
          additional_owners: add,
          staff_bot: bot.staff ? bot.staff : false,
          short: bot.short,
          long: bot.long,
          library: bot.library,
          nsfw: bot.nsfw,
          programs: {
            premium: bot.premium ? bot.premium : false,
            certified: bot.certified ? bot.certified : false,
          },
          analytics: {
            servers: bot.servers ? bot.servers : '0',
            shards: bot.shards ? bot.shards : '0',
            votes: bot.votes ? bot.votes : '0',
            views: bot.clicks ? bot.clicks : '0',
            invites: bot.invite_clicks ? bot.invite_clicks : '0',
          },
          links: {
            website: bot.website,
            donate: bot.donate,
            support: bot.support,
            github: bot.github,
            banner: bot.background,
            invite: bot.invite,
          },
        });
      } else {
        return res.status(400).send({
          message:
            'Unable to find that Bot in our System, Has it been approved?',
          error: true,
          fatal: false,
          status: 400,
        });
      }
    },
  );
};
