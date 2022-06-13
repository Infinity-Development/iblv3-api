const { MessageEmbed, version } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');

const banned = new MessageEmbed();
const already_banned = new MessageEmbed();
const already_unbanned = new MessageEmbed();
const unbanned = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'voteban',
  description: '..idk what to put here lol',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,
  disabled: false,
  options: [
    {
      name: 'option',
      type: 'STRING',
      required: true,
      description: 'Please provide a option.',
      choices: [
        {
          name: 'true',
          value: 'true',
        },
        {
          name: 'false',
          value: 'false',
        },
      ],
    },
    {
      name: 'user_id',
      type: 'STRING',
      required: false,
      description: 'Please provide a user id.',
    },
    {
      name: 'user_mention',
      type: 'USER',
      required: false,
      description: 'Please provide a user.',
    },
  ],
  run: async (client, interaction, args) => {
    try {
      let option = interaction.options.getString('option');
      let userid = interaction.options.getString('user_id');
      let usermention = interaction.options.getUser('user_mention');
      if (option === 'true') {
        if (userid) {
          let fetchUserTag = client.users.cache.get(userid)
            ? client.users.cache.get(userid).tag
            : userid || 'Unknown';
          let db_user = await fetchSomeUser(userid);
          if (db_user.vote_banned) {
            already_banned.setTitle('Already Vote Banned');
            already_banned.setColor('RED');
            already_banned.setDescription(
              `${fetchUserTag} has already been vote banned.`,
            );
            already_banned.setFooter({
              text: client.footer,
            });
            return interaction.followUp({
              embeds: [already_banned],
            });
          }
          db_user.vote_banned = true;
          db_user.save();
          banned.setTitle('Vote Ban');
          banned.setColor(client.color);
          banned.setDescription(
            `${fetchUserTag} has been banned from voting due to possible abuse of our API.`,
          );
          banned.setFooter({
            text: client.footer,
          });

          return interaction.followUp({
            embeds: [banned],
          });
        }
        if (usermention) {
          let fetchUserTag = client.users.cache.get(usermention)
            ? client.users.cache.get(usermention).tag
            : usermention || 'Unknown';
          let db_user = await fetchSomeUser(usermention.id);
          if (db_user.vote_banned) {
            already_banned.setTitle('Already Vote Banned');
            already_banned.setColor('RED');
            already_banned.setDescription(
              `${fetchUserTag} has already been vote banned.`,
            );
            already_banned.setFooter({
              text: client.footer,
            });
            return interaction.followUp({
              embeds: [already_banned],
            });
          }
          db_user.vote_banned = true;
          db_user.save();
          banned.setTitle('Vote Ban');
          banned.setColor(client.color);
          banned.setDescription(
            `${fetchUserTag} has been banned from voting due to possible abuse of our API.`,
          );
          banned.setFooter({
            text: client.footer,
          });

          return interaction.followUp({
            embeds: [banned],
          });
        }
      }
      if (option === 'false') {
        if (userid) {
          let fetchUserTag = client.users.cache.get(userid)
            ? client.users.cache.get(userid).tag
            : userid || 'Unknown';
          let db_user = await fetchSomeUser(userid);
          if (!db_user.vote_banned) {
            already_unbanned.setTitle('Already Vote Unbanned');
            already_unbanned.setColor('RED');
            already_unbanned.setDescription(
              `${fetchUserTag} has already been unbanned.`,
            );
            already_unbanned.setFooter({
              text: client.footer,
            });
            return interaction.followUp({
              embeds: [already_unbanned],
            });
          }
          db_user.vote_banned = false;
          db_user.save();
          unbanned.setTitle('Vote Unbanned');
          unbanned.setColor(client.color);
          unbanned.setDescription(`${fetchUserTag} has been unbanned.`);
          unbanned.setTimestamp();
          unbanned.setFooter({
            text: client.footer,
          });

          return interaction.followUp({
            embeds: [unbanned],
          });
        }
        if (usermention) {
          let fetchUserTag = client.users.cache.get(usermention)
            ? client.users.cache.get(usermention).tag
            : usermention || 'Unknown';
          let db_user = await fetchSomeUser(usermention.id);
          if (!db_user.vote_banned) {
            already_unbanned.setTitle('Already Vote Unbanned');
            already_unbanned.setColor('RED');
            already_unbanned.setDescription(
              `${fetchUserTag} has already been unbanned.`,
            );
            already_unbanned.setFooter({
              text: client.footer,
            });
            return interaction.followUp({
              embeds: [already_unbanned],
            });
          }
          db_user.vote_banned = false;
          db_user.save();
          unbanned.setTitle('Vote Unbanned');
          unbanned.setColor(client.color);
          unbanned.setDescription(`${fetchUserTag} has been unbanned.`);
          unbanned.setTimestamp();
          unbanned.setFooter({
            text: client.footer,
          });

          return interaction.followUp({
            embeds: [unbanned],
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
