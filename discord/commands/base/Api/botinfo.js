const { MessageEmbed } = require('discord.js');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');

const no_bot = new MessageEmbed();
const not_bot = new MessageEmbed();
const not_found = new MessageEmbed();
const bot_info = new MessageEmbed();
const error_public = new MessageEmbed();
const error_private = new MessageEmbed();

module.exports = {
  name: 'botinfo',
  category: 'Api',
  disabled: false,
  description: 'Fetch some info about the Provided Bot from our API.',
  usage: '<mention/id>',
  args: false,
  aliases: ['bi', 'botinfo'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,

  run: async (message, args, client) => {
    try {
      let bot =
        (await message.mentions.users.first()) ||
        client.users.cache.get(args[0]) ||
        'Unknown';
      if (!bot) {
        no_bot.setTitle('Invalid Args');
        no_bot.setColor('RED');
        no_bot.setDescription('Unable to find a bot with that ID');
        no_bot.setFooter({
          text: client.footer,
        });
        return message.reply({
          embeds: [no_bot],
        });
      }
      if (!bot.bot) {
        not_bot.setTitle('Invalid Client Type');
        not_bot.setColor('RED');
        not_bot.setDescription('Please provide a Bot ID to fetch!');
        not_bot.setFooter({
          text: client.footer,
        });
        return message.reply({
          embeds: [not_bot],
        });
      }
      let db_bot = await fetchSomeBot(bot.id);
      if (!db_bot) {
        not_found.setTitle('Bot Not Found!');
        not_found.setColor('RED');
        not_found.setDescription(
          'Unable to locate a bot with that ID in our System',
        );
        not_found.setFooter({
          text: client.footer,
        });
        return message.reply({
          embeds: [not_found],
        });
      } else {
        let fetchOwner = client.users.cache.get(db_bot.main_owner)
          ? client.users.cache.get(db_bot.main_owner).tag
          : db_bot.main_owner || 'Unknown';
        (seconds = parseInt((db_bot.uptime / 1000) % 60)),
          (minutes = parseInt((db_bot.uptime / (1000 * 60)) % 60)),
          (hours = parseInt((db_bot.uptime / (1000 * 60 * 60)) % 24));
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        bot_info.setAuthor({
          name: `${db_bot.botName} - Information`,
        });
        bot_info.setColor(client.color);
        bot_info.setDescription(
          `${
            db_bot.short
              ? db_bot.short
              : 'Unable to fetch the Short Description'
          }`,
        );
        bot_info.addField(
          'Bot ID:',
          `${db_bot.botID ? db_bot.botID : 'Unable to fetch the Bot ID.'}`,
        );
        bot_info.addField('Owner:', `${fetchOwner}`);
        bot_info.addField('Uptime:', `${hours}h ${minutes}m ${seconds}s`);
        bot_info.addField(
          'Guilds:',
          `${db_bot.servers ? db_bot.servers : '0'}`,
        );
        bot_info.addField('Shards:', `${db_bot.shards ? db_bot.shards : '0'}`);
        bot_info.addField('Votes:', `${db_bot.votes ? db_bot.votes : '0'}`);
        bot_info.addField('Views:', `${db_bot.clicks ? db_bot.clicks : '0'}`);
        bot_info.addField(
          'Invites:',
          `${db_bot.invite_clicks ? db_bot.invite_clicks : '0'}`,
        );
        bot_info.addField(
          'View Bot:',
          `[Click Here](https://infinitybots.gg/bots/${db_bot.botID})`,
        );
        bot_info.setFooter({
          text: client.footer,
        });
        return message.reply({
          embeds: [bot_info],
        });
      }
    } catch (err) {
      error_public.setAuthor({
        name: 'Internal Command Error',
        iconURL: client.logo,
      });
      error_public.setColor('RED');
      error_public.setDescription(
        'An error has occurred with this command and Our Dev Team has been notified!',
      );
      error_public.setTimestamp();
      error_public.setFooter({
        text: client.footer,
      });
      await message.reply({
        embeds: [error_public],
      });
      error_private.setAuthor({
        name: 'Internal Command Error',
        iconURL: client.logo,
      });
      error_private.setColor('RED');
      error_private.setDescription(`\`\`\`yaml\n${err.stack}\`\`\``);
      error_private.setTimestamp();
      error_private.setFooter({
        text: client.footer,
      });
      return sendErrorMessage({
        embeds: [error_private],
      });
    }
  },
};
