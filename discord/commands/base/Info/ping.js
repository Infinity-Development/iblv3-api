const {
  MessageEmbed,
  MessageSelectMenu,
  MessageButton,
  MessageActionRow,
} = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');

module.exports = {
  name: 'ping',
  category: 'Info',
  disabled: false,
  description: 'This will display the Bots Latency',
  aliases: [],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,

  run: async (message, args, client) => {
    try {
      const ping = new MessageEmbed()
        .setAuthor({
          name: 'Ping',
          iconURL: client.logo,
        })
        .setColor(client.color)
        .setThumbnail(client.logo)
        .addField(`Websocket:`, `\`${Math.round(client.ws.ping)}ms\``)
        .addField(`Latency:`, `\`${Date.now() - message.createdTimestamp}ms\``)
        .setFooter({
          text: client.footer,
        });
      return message.reply({
        embeds: [ping],
      });
    } catch (error) {
      const public = new MessageEmbed()
        .setTitle('Internal Server Error')
        .setColor('RED')
        .setDescription(
          'An error has occurred with this command. My Dev Team has been notified of the incident!',
        )
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
