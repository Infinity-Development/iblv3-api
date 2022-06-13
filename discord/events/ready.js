const loadInteractions = require('@Handlers/discord/loadInteractions');
const { sendBuiltinMessage } = require('@Configs/messages/sendBuiltinMessage');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { DatabaseClient } = require('@Handlers/database/client');
const api_startup = require('@Handlers/client/fastify');
const Console = require('@Handlers/logger/index');
const { MessageEmbed } = require('discord.js');
const config = require('@Configs/index');

module.exports = async (client) => {
  try {
    await DatabaseClient(config.database.mongo);

    await api_startup(client);

    Console.SendLogs(
      'Infinity API Discord Client is Online and Ready!',
      'ready',
    );

    client.user.setActivity(
      `${config.client.prefix}help | api.infinitybotlist.com`,
      { type: 'WATCHING' },
    );

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Startup Success!', iconURL: client.logo })
      .setColor(client.color)
      .setThumbnail(client.logo)
      .setDescription('Okay, All systems are a go chief!')
      .setTimestamp()
      .setFooter({ text: client.footer });

    sendBuiltinMessage(
      { embeds: [embed] },
      {
        guild: config.guilds.devGuild,
        channel: config.logs.apiLogs,
      },
    );

    await loadInteractions();

    await client.application.commands.set(client.slash);
  } catch (err) {
    const error_msg = new MessageEmbed()
      .setAuthor({ name: 'Internal Command Error' })
      .setColor('RED')
      .setDescription(`\`\`\`yaml\n${err.stack}\`\`\``)
      .setTimestamp()
      .setFooter({ text: client.footer });

    await sendErrorMessage({ embeds: [error_msg] });
  }
};
