const { MessageEmbed } = require('discord.js');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');

module.exports = {
  name: 'staffstats',
  category: 'Api',
  disabled: false,
  description: 'Check out some Stats about the Provided Staff Member.',
  usage: '<mention/id>',
  args: false,
  aliases: ['ss', 'staff-statistics'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,

  run: async (message, args, client) => {
    try {
      let user =
        (await message.mentions.users.first()) ||
        client.users.cache.get(args[0]);

      if (!args[0] || !user) {
        let embed = new MessageEmbed()
          .setTitle('Woah, You serious?')
          .setColor('RED')
          .setDescription('Invalid or Missing Args')
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });

        return message.reply({
          embeds: [embed],
        });
      }
      let isUser = await fetchSomeUser(user.id);
      if (!isUser) {
        let embed = new MessageEmbed()
          .setTitle('Woah, You serious?')
          .setColor('RED')
          .setDescription('That user can not be found in our Database!')
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });
        return message.reply({
          embeds: [embed],
        });
      } else if (!isUser.staff) {
        let embed = new MessageEmbed()
          .setTitle('Lol are you a noob?')
          .setColor('RED')
          .setDescription(
            'That user is not a Active Member of the Infinity Staff. Please make sure they have been added to our Staff DB if you think this is a mistake!',
          )
          .setTimestamp()
          .setFooter({
            text: client.footer,
          });

        return message.reply({
          embeds: [embed],
        });
      } else {
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${user.tag} Staff Statistics`,
            iconURL: `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`,
          })
          .setColor(client.color)
          .setThumbnail(
            `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`,
          )
          .addField(
            'Approved Bots',
            `${
              isUser.new_staff_stats.get('approved_bots')
                ? `${isUser.new_staff_stats.get('approved_bots')}`
                : '0'
            }`,
          )
          .addField(
            'Certified Bots',
            `${
              isUser.new_staff_stats.get('certified_bots')
                ? `${isUser.new_staff_stats.get('certified_bots')}`
                : '0'
            }`,
          )
          .addField(
            'Denied Bots',
            `${
              isUser.new_staff_stats.get('denied_bots')
                ? `${isUser.new_staff_stats.get('denied_bots')}`
                : '0'
            }`,
          )
          .setFooter({
            text: client.footer,
          });
        return message.reply({
          embeds: [embed],
        });
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
