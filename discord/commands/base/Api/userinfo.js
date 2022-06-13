const { MessageEmbed } = require('discord.js');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

module.exports = {
  name: 'userinfo',
  category: 'Api',
  disabled: false,
  description: 'Fetch some info about the Provided User from our API.',
  usage: '<mention/id>',
  args: true,
  aliases: ['ui', 'userinfo'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,

  run: async (message, args, client) => {
    try {
      let user =
        (await message.mentions.users.first()) ||
        client.users.cache.get(args[0]) ||
        'Unknown';
      if (!args[0]) {
        const embed = new MessageEmbed()
          .setTitle('No User Provided')
          .setColor('RED')
          .setDescription('Please provide a User Mention or ID')
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });

        return message.reply({
          embeds: [embed],
        });
      } else if (!user) {
        const embed = new MessageEmbed()
          .setTitle('No User Provided')
          .setColor('RED')
          .setDescription('Please provide a User Mention or ID')
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });

        return message.reply({
          embeds: [embed],
        });
      } else if (user.bot) {
        const embed = new MessageEmbed()
          .setTitle('Invalid User Provided')
          .setColor('RED')
          .setDescription(
            `To fetch info for a Bot in our List please use ${config.client.prefix}botinfo <@Bot>`,
          )
          .addField(
            'NOTE:',
            'This command is for User Level Accounts. Please provide a User ID or Mention',
          )
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });

        return message.reply({
          embeds: [embed],
        });
      } else {
        let db_user = await fetchSomeUser(user.id);
        if (!db_user) {
          const embed = new MessageEmbed()
            .setTitle('Whoops, You sure?')
            .setColor('RED')
            .setDescription('Unable to find that User in our System.')
            .setTimestamp()
            .setFooter({
              text: client.footer,
            });
          return message.reply({
            embeds: [embed],
          });
        } else {
          const embed = new MessageEmbed()
            .setAuthor({
              name: `${user.tag} - Information`,
              iconURL: `${user.displayAvatarURL({
                dynamic: true,
                size: 1024,
              })}`,
            })
            .setThumbnail(
              `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`,
            )
            .setDescription(`${db_user.about}`)
            .addField(
              'Nickname:',
              `${
                db_user.nickname ? db_user.nickname : 'Unable to Fetch Nickname'
              }`,
            )
            .addField(
              'User ID:',
              `${db_user.userID ? db_user.userID : 'Unable to Fetch User ID'}`,
            );
          user_info
            .addField('Staff:', `${db_user.staff ? 'Yes' : 'No'}`)
            .addField('Admin:', `${db_user.admin ? 'Yes' : 'No'}`)
            .addField('Developer:', `${db_user.developer ? 'Yes' : 'No'}`)
            .addField('Certified:', `${db_user.certified ? 'Yes' : 'No'}`)
            .addField('Vote Banned:', `${db_user.vote_banned ? 'Yes' : 'No'}`)
            .addField(
              'Website:',
              `${
                db_user.website
                  ? `[Click Here](${db_user.website})`
                  : 'Unable to Fetch Website Link'
              }`,
            )
            .addField(
              'GitHub:',
              `${
                db_user.github
                  ? `[Click Here](${db_user.github})`
                  : 'Unable to Fetch GitHub Link'
              }`,
            )
            .setColor(client.color)
            .setFooter({
              text: client.footer,
            });
          return message.reply({
            embeds: [embed],
          });
        }
      }
    } catch (err) {
      var error_public = new MessageEmbed()
        .setAuthor({
          name: 'Internal Command Error',
          iconURL: client.logo,
        })
        .setColor('RED')
        .setDescription(
          'An error has occurred with this command and Our Dev Team has been notified!',
        )
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      await message.reply({
        embeds: [error_public],
      });
      var error_private = new MessageEmbed()
        .setAuthor({
          name: 'Internal Command Error',
          iconURL: client.logo,
        })
        .setColor('RED')
        .setDescription(`\`\`\`yaml\n${err.stack}\`\`\``)
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      return sendErrorMessage({
        embeds: [error_private],
      });
    }
  },
};
