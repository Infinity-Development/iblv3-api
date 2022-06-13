const { MessageEmbed } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const Console = require('@Handlers/logger/index');

const not_found = new MessageEmbed();
const not_staff = new MessageEmbed();
const staff_stats = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'staffstats',
  description: 'Check out some Stats about the Provided Staff Member.',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,
  disabled: false,
  options: [
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
      let usermention = interaction.options.getUser('user_mention');
      let userid = interaction.options.getString('user_id');
      if (usermention) {
        let db_user = await fetchSomeUser(usermention.id);
        if (!db_user) {
          not_found.setTitle('Whoops, You sure?');
          not_found.setColor('RED');
          not_found.setDescription('Unable to find that User in our System.');
          not_found.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [not_found],
          });
        } else if (!db_user.staff) {
          not_staff.setTitle('Lol are you a noob?');
          not_staff.setColor('RED');
          not_staff.setDescription(
            'That user is not a Active Member of the Infinity Staff. Please make sure they have been added to our Staff DB if you think this is a mistake!',
          );
          not_staff.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [not_staff],
          });
        } else {
          staff_stats.setAuthor({
            name: `${usermention.tag} - Staff Statistics`,
            iconURL: `${usermention.displayAvatarURL()}`,
          });
          staff_stats.setColor(client.color);
          staff_stats.setThumbnail(`${usermention.displayAvatarURL()}`);
          staff_stats.addField(
            'Approved Bots',
            `${
              db_user.new_staff_stats.get('approved_bots')
                ? `${db_user.new_staff_stats.get('approved_bots')}`
                : '0'
            }`,
          );
          staff_stats.addField(
            'Certified Bots',
            `${
              db_user.new_staff_stats.get('certified_bots')
                ? `${db_user.new_staff_stats.get('certified_bots')}`
                : '0'
            }`,
          );
          staff_stats.addField(
            'Denied Bots',
            `${
              db_user.new_staff_stats.get('denied_bots')
                ? `${db_user.new_staff_stats.get('denied_bots')}`
                : '0'
            }`,
          );
          staff_stats.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [staff_stats],
          });
        }
      }
      if (userid) {
        let db_user = await fetchSomeUser(userid);
        if (!db_user) {
          not_found.setTitle('Whoops, You sure?');
          not_found.setColor('RED');
          not_found.setDescription('Unable to find that User in our System.');
          not_found.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [not_found],
          });
        } else if (!db_user.staff) {
          not_staff.setTitle('Lol are you a noob?');
          not_staff.setColor('RED');
          not_staff.setDescription(
            'That user is not a Active Member of the Infinity Staff. Please make sure they have been added to our Staff DB if you think this is a mistake!',
          );
          not_staff.setTimestamp();
          not_staff.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [not_staff],
          });
        } else {
          let fetchUserTag = client.users.cache.get(userid)
            ? client.users.cache.get(userid).tag
            : userid || 'Unknown';
          let fetchUserAvatar = client.users.cache.get(userid)
            ? client.users.cache.get(userid).displayAvatarURL()
            : userid || null;
          staff_stats.setAuthor({
            name: `${fetchUserTag} - Staff Statistics`,
            iconURL: `${fetchUserAvatar}`,
          });
          staff_stats.setColor(client.color);
          staff_stats.setThumbnail(`${fetchUserAvatar}`);
          staff_stats.addField(
            'Approved Bots',
            `${
              db_user.new_staff_stats.get('approved_bots')
                ? `${db_user.new_staff_stats.get('approved_bots')}`
                : '0'
            }`,
          );
          staff_stats.addField(
            'Certified Bots',
            `${
              db_user.new_staff_stats.get('certified_bots')
                ? `${db_user.new_staff_stats.get('certified_bots')}`
                : '0'
            }`,
          );
          staff_stats.addField(
            'Denied Bots',
            `${
              db_user.new_staff_stats.get('denied_bots')
                ? `${db_user.new_staff_stats.get('denied_bots')}`
                : '0'
            }`,
          );
          staff_stats.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [staff_stats],
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
