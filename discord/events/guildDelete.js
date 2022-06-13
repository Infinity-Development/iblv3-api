const { MessageEmbed, MessageSelectMenu } = require('discord.js');
const loadInteractions = require('@Handlers/discord/loadInteractions');
const { sendInviteMessage } = require('@Configs/messages/sendInviteMessage');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const moment = require('moment');

const server_info = new MessageEmbed();
const private_err = new MessageEmbed();

module.exports = async (client, guild) => {
  try {
    let own = await guild.fetchOwner();
    let owner = (await guild.members.cache.get(own.id))
      ? guild.members.cache.get(own.id).user.tag
      : 'Unable to Fetch Guild Owner';

    server_info.setTitle('Left a Guild!');
    server_info.setColor(client.color);
    server_info.setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));
    server_info.addField('Guild Name:', `\`${guild.name}\``);
    server_info.addField('Guild ID:', `\`${guild.id}\``);
    server_info.addField('Guild Owner:', `${owner}`);
    server_info.addField('Member Count:', `\`${guild.memberCount}\` Members`);
    server_info.addField(
      'Created At:',
      `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\``,
    );
    server_info.setTimestamp();
    server_info.setFooter({ text: client.footer });

    return sendInviteMessage({ embeds: [server_info] });
  } catch (err) {
    private_err.setAuthor({ name: 'Internal Command Error' });
    private_err.setColor('RED');
    private_err.setDescription(`\`\`\`yaml\n${err.stack}\`\`\``);
    private_err.setTimestamp();
    private_err.setFooter({ text: client.footer });

    await sendErrorMessage({ embeds: [private_err] });

    return Console.SendLogs(`${err.stack}`, 'error');
  }
};
