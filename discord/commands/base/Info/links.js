const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');

module.exports = {
  name: 'links',
  category: 'Info',
  disabled: false,
  description: 'Fetch a list of our Website Links',
  aliases: ['support', 'in', 'invite', 'website'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,

  run: async (message, args, client) => {
    try {
      let btn = new MessageButton()
        .setLabel('Bot Invite')
        .setURL(config.client.support.invite)
        .setStyle(5);
      let btn2 = new MessageButton()
        .setLabel('Website')
        .setURL(config.links.webLink)
        .setStyle(5);
      let btn3 = new MessageButton()
        .setLabel('Discord')
        .setURL(config.client.support.server)
        .setStyle(5);
      let btn4 = new MessageButton()
        .setLabel('Documentation')
        .setURL(config.links.docsLink)
        .setStyle(5);
      let ButtonsRow = new MessageActionRow().addComponents(
        btn,
        btn2,
        btn3,
        btn4,
      );
      const embed = new MessageEmbed()
        .setTitle('Useful Links')
        .setColor(client.color)
        .setThumbnail(client.logo)
        .setDescription('Below is a list of some Helpful Links!')
        .setFooter({
          text: client.footer,
        });
      return message.reply({
        embeds: [embed],
        components: [ButtonsRow],
      });
    } catch (error) {
      const public = new MessageEmbed()
        .setTitle('Internal Server Error')
        .setColor('RED')
        .setDescription(
          'An error has occurred with this command. My Dev Team has been notified of the incident!',
        )
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      await message.reply({
        embeds: [public],
      });
      const private = new MessageEmbed()
        .setTitle('Internal Server Error')
        .setColor('RED')
        .setDescription(`\`\`\`yaml\n${error.stack}\`\`\``)
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      await sendErrorMessage({
        embeds: [private],
      });
      return Console.SendLogs(`${error.stack}`, 'error');
    }
  },
};
