const { MessageEmbed } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');

const not_found = new MessageEmbed();
const no_bot = new MessageEmbed();
const bot_info = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'botinfo',
  description: 'Fetch some info about the Provided Bot from our API.',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,
  disabled: false,
  options: [
    {
      name: 'bot_id',
      type: 'STRING',
      required: false,
      description: 'Please provide a bot id.',
    },
    {
      name: 'bot_mention',
      type: 'USER',
      required: false,
      description: 'Please provide a bot.',
    },
  ],
  run: async (client, interaction, args) => {
    try {
      let botmention = interaction.options.getUser('bot_mention');
      let botid = interaction.options.getString('bot_id');
      if (botmention) {
        let db_bot = await fetchSomeBot(botmention.id);
        if (!botmention.bot) {
          no_bot.setTitle('Invalid Args');
          no_bot.setColor('RED');
          no_bot.setDescription('Unable to find a bot with that ID');
          no_bot.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [no_bot],
          });
        }
        if (!db_bot) {
          not_found.setTitle('Bot Not Found!');
          not_found.setColor('RED');
          not_found.setDescription(
            'Unable to locate a bot with that ID in our System.',
          );
          not_found.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
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
          bot_info.setDescription(`${db_bot.short}`);
          bot_info.addField('Bot ID:', `${db_bot.botID || 'ID Unavailable'}`);
          bot_info.addField('Owner:', `${fetchOwner}`);
          bot_info.addField('Uptime:', `${hours}h ${minutes}m ${seconds}s`);
          bot_info.addField(
            'Guilds:',
            `${db_bot.servers ? `${db_bot.servers}` : `0`}`,
          );
          bot_info.addField(
            'Shards:',
            `${db_bot.shards ? `${db_bot.shards}` : `0`}`,
          );
          bot_info.addField(
            'Votes:',
            `${db_bot.votes ? `${db_bot.votes}` : `0`}`,
          );
          bot_info.addField(
            'Total Views:',
            `${db_bot.clicks ? `${db_bot.clicks}` : `0`}`,
          );
          bot_info.addField(
            'Total Invites:',
            `${db_bot.invite_clicks ? `${db_bot.invite_clicks}` : `0`}`,
          );
          bot_info.addField(
            'View Bot:',
            `[Click Here](https://api.infinitybotlist.com/${db_bot.botID})`,
          );
          bot_info.setFooter({
            text: client.footer,
          });
          bot_info.setColor(client.color);
          return interaction.followUp({
            embeds: [bot_info],
          });
        }
      }
      if (botid) {
        let db_bot = await fetchSomeBot(botid);
        if (!botid) {
          no_bot.setTitle('Invalid Args');
          no_bot.setColor('RED');
          no_bot.setDescription('Unable to find a bot with that ID');
          no_bot.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [no_bot],
          });
        }
        if (!db_bot) {
          not_found.setTitle('Bot Not Found!');
          not_found.setColor('RED');
          not_found.setDescription(
            'Unable to locate a bot with that ID in our System.',
          );
          not_found.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
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
          bot_info.setDescription(`${db_bot.short}`);
          bot_info.addField('Bot ID:', `${db_bot.botID || 'ID Unavailable'}`);
          bot_info.addField('Owner:', `${fetchOwner}`);
          bot_info.addField('Uptime:', `${hours}h ${minutes}m ${seconds}s`);
          bot_info.addField(
            'Guilds:',
            `${db_bot.servers ? `${db_bot.servers}` : `0`}`,
          );
          bot_info.addField(
            'Shards:',
            `${db_bot.shards ? `${db_bot.shards}` : `0`}`,
          );
          bot_info.addField(
            'Votes:',
            `${db_bot.votes ? `${db_bot.votes}` : `0`}`,
          );
          bot_info.addField(
            'Total Views:',
            `${db_bot.clicks ? `${db_bot.clicks}` : `0`}`,
          );
          bot_info.addField(
            'Total Invites:',
            `${db_bot.invite_clicks ? `${db_bot.invite_clicks}` : `0`}`,
          );
          bot_info.addField(
            'View Bot:',
            `[Click Here](https://api.infinitybotlist.com/${db_bot.botID})`,
          );
          bot_info.setFooter({
            text: client.footer,
          });
          bot_info.setColor(client.color);
          return interaction.followUp({
            embeds: [bot_info],
          });
        }
      }
    } catch (err) {
      public.setTitle('Internal Slash Command Error');
      public.setColor('RED');
      public.setDescription(
        'An error has occurred with this command. My Dev Team has been notified of the incident!',
      );
      public.setTimestamp();
      public.setFooter({
        text: client.footer,
      });
      private.setTitle('Internal Slash Command Error');
      private.setColor('RED');
      private.setDescription(`\`\`\`yaml\n${err.stack}\`\`\``);
      private.setTimestamp();
      await interaction.followUp({
        embeds: [public],
      });
      await sendErrorMessage({
        embeds: [private],
      });
      return Console.SendLogs(`${err.stack}`, 'error');
    }
  },
};
