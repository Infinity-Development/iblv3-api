const { MessageEmbed, version } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { time } = require('@discordjs/builders');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');
const si = require('systeminformation');
const os = require('os');

module.exports = {
  name: 'stats',
  category: 'Info',
  disabled: false,
  description: 'Some Statistics for the Bot.',
  aliases: ['st', 'info'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,

  run: async (message, args, client) => {
    try {
      const cpu = await si.cpu();
      let ccount = client.channels.cache.size;
      let scount = client.guilds.cache.size;
      let mcount = 0;
      client.guilds.cache.forEach((guild) => {
        mcount += guild.memberCount;
      });
      const botValue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);
      const embed = new MessageEmbed()
        .setTitle(`${client.user.username} - Information`)
        .setColor(client.color)
        .setThumbnail(client.logo)
        .addField('Name:', `${client.user.tag}`)
        .addField('Developers:', '• `Toxic Dev#5936`\n• `ThunderDoesDev#6666`')
        .addField('Creation:', `${time(client.user.createdAt, 'R')}`, true)
        .addField('Ping:', `${Math.round(client.ws.ping)}ms`, true)
        .addField('Uptime:', `<t:${botValue}:R>`, true)
        .addField('Discord.js:', `${version}`, true)
        .addField('Node.js:', `${process.version}`, true)
        .addField('Guilds:', `${scount}`, true)
        .addField('Channels:', `${ccount}`, true)
        .addField('Users:', `${mcount}`, true)
        .addField('Platform:', `${os.type}`, true)
        .addField('CPU Total Cores:', `${cpu.cores}`, true)
        .addField('CPU Physical Cores:', `${cpu.physicalCores}`, true)
        .addField('CPU Model:', `${os.cpus()[0].model}`, true)
        .addField('CPU Speed:', `${os.cpus()[0].speed} MHz`, true)
        .addField('CPU Processors:', `${cpu.processors}`, true)
        .addField(
          'Total Memory:',
          `${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps`,
          true,
        )
        .addField(
          'Heap Total:',
          `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps`,
          true,
        )
        .addField(
          'Heap Usage:',
          `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps`,
          true,
        )
        .setFooter({
          text: client.footer,
        });
      return message.reply({
        embeds: [embed],
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
