const { MessageEmbed } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');

const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'ping',
  description: 'Display the Bot Latency.',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,
  disabled: false,

  run: async (client, interaction, args) => {
    const ping = new MessageEmbed()
      .setAuthor({
        name: 'Ping',
        iconURL: client.logo,
      })
      .setColor(client.color)
      .setThumbnail(client.logo)
      .addField(`Websocket:`, `\`${Math.round(client.ws.ping)}ms\``)
      .addField(
        `Latency:`,
        `\`${Date.now() - interaction.createdTimestamp}ms\``,
      )
      .setFooter({
        text: client.footer,
      });

    return interaction.channel.send({
      embeds: [ping],
    });
  },
};
