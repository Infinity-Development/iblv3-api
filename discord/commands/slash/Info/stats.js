const { MessageEmbed, version } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { time } = require('@discordjs/builders');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');
const si = require('systeminformation');
const os = require('os');

const stats = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'stats',
  description: 'Display the Bot Stats.',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,
  disabled: false,

  run: async (client, interaction, args) => {
    try {
      const cpu = await si.cpu();
      let ccount = client.channels.cache.size;
      let scount = client.guilds.cache.size;
      let mcount = 0;
      client.guilds.cache.forEach((guild) => {
        mcount += guild.memberCount;
      });
      const botValue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);
      stats.setTitle(`${client.user.username} - Information`);
      stats.setColor(client.color);
      stats.setThumbnail(client.logo);
      stats.addField('Name:', `${client.user.tag}`);
      stats.addField(
        'Developers:',
        '• `Toxic Dev#5936`\n• `ThunderDoesDev#6666`',
      );
      stats.addField('Creation:', `${time(client.user.createdAt, 'R')}`, true);
      stats.addField('Ping:', `${Math.round(client.ws.ping)}ms`, true);
      stats.addField('Uptime:', `<t:${botValue}:R>`, true);
      stats.addField('Discord.js:', `${version}`, true);
      stats.addField('Node.js:', `${process.version}`, true);
      stats.addField('Guilds:', `${scount}`, true);
      stats.addField('Channels:', `${ccount}`, true);
      stats.addField('Users:', `${mcount}`, true);
      stats.addField('Platform:', `${os.type}`, true);
      stats.addField('CPU Total Cores:', `${cpu.cores}`, true);
      stats.addField('CPU Physical Cores:', `${cpu.physicalCores}`, true);
      stats.addField('CPU Model:', `${os.cpus()[0].model}`, true);
      stats.addField('CPU Speed:', `${os.cpus()[0].speed} MHz`, true);
      stats.addField('CPU Processors:', `${cpu.processors}`, true);
      stats.addField(
        'Total Memory:',
        `${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps`,
        true,
      );
      stats.addField(
        'Heap Total:',
        `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps`,
        true,
      );
      stats.addField(
        'Heap Usage:',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps`,
        true,
      );
      stats.setFooter({
        text: client.footer,
      });
      return interaction.followUp({
        embeds: [stats],
      });
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
