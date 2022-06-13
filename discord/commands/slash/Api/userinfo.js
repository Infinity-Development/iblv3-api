const { MessageEmbed } = require('discord.js');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

const not_found = new MessageEmbed();
const user_info = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'userinfo',
  description: 'Fetch some info about the Provided User from our API.',
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
        } else {
          user_info.setAuthor({
            name: `${usermention.tag} - Information`,
            iconURL: `${usermention.displayAvatarURL()}`,
          });
          user_info.setThumbnail(`${usermention.displayAvatarURL()}`);
          user_info.setDescription(`${db_user.about}`);
          user_info.addField(
            'Nickname:',
            `${
              db_user.nickname ? db_user.nickname : 'Unable to Fetch Nickname'
            }`,
          );
          user_info.addField(
            'User ID:',
            `${db_user.userID ? db_user.userID : 'Unable to Fetch User ID'}`,
          );
          user_info.addField('Staff:', `${db_user.staff ? 'Yes' : 'No'}`);
          user_info.addField('Admin:', `${db_user.admin ? 'Yes' : 'No'}`);
          user_info.addField(
            'Developer:',
            `${db_user.developer ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Certified:',
            `${db_user.certified ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Vote Banned:',
            `${db_user.vote_banned ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Website:',
            `${
              db_user.website
                ? `[Click Here](${db_user.website})`
                : 'Unable to Fetch Website Link'
            }`,
          );
          user_info.addField(
            'GitHub:',
            `${
              db_user.github
                ? `[Click Here](${db_user.github})`
                : 'Unable to Fetch GitHub Link'
            }`,
          );
          user_info.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [user_info],
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
        } else {
          let fetchUserTag = client.users.cache.get(userid)
            ? client.users.cache.get(userid).tag
            : userid || 'Unknown';
          let fetchUserAvatar = client.users.cache.get(userid)
            ? client.users.cache.get(userid).displayAvatarURL()
            : userid || null;
          user_info.setAuthor({
            name: `${fetchUserTag} - Information`,
            iconURL: `${fetchUserAvatar}`,
          });
          user_info.setThumbnail(`${fetchUserAvatar}`);
          user_info.setDescription(`${db_user.about}`);
          user_info.addField(
            'Nickname:',
            `${
              db_user.nickname ? db_user.nickname : 'Unable to Fetch Nickname'
            }`,
          );
          user_info.addField(
            'User ID:',
            `${db_user.userID ? db_user.userID : 'Unable to Fetch User ID'}`,
          );
          user_info.addField('Staff:', `${db_user.staff ? 'Yes' : 'No'}`);
          user_info.addField('Admin:', `${db_user.admin ? 'Yes' : 'No'}`);
          user_info.addField(
            'Developer:',
            `${db_user.developer ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Certified:',
            `${db_user.certified ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Vote Banned:',
            `${db_user.vote_banned ? 'Yes' : 'No'}`,
          );
          user_info.addField(
            'Website:',
            `${
              db_user.website
                ? `[Click Here](${db_user.website})`
                : 'Unable to Fetch Website Link'
            }`,
          );
          user_info.addField(
            'GitHub:',
            `${
              db_user.github
                ? `[Click Here](${db_user.github})`
                : 'Unable to Fetch GitHub Link'
            }`,
          );
          user_info.setFooter({
            text: client.footer,
          });
          return interaction.followUp({
            embeds: [user_info],
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
