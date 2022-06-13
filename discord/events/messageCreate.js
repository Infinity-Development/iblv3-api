const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const UsersStorage = require('@Models/models/users');
const { MessageEmbed } = require('discord.js');
const config = require('@Configs/index');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  let prefix = config.client.prefix;

  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

  if (message.content.match(mention)) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'How can i help you?' })
      .setColor(client.color)
      .setDescription('You seem a little lost!')
      .addField('My Preifx:', '``api!`` || ``@Mention``')
      .addField('Help Command', '``api!help`` || ``@Infinity API help``')
      .setTimestamp()
      .setFooter({ text: client.footer });

    return message.reply({ embeds: [embed] });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,
  );

  if (!prefixRegex.test(message.content)) return;

  const [matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );

  if (!command) return;

  const embed_builder = new MessageEmbed()
    .setTitle('Command Error Raised!')
    .setColor('RED')
    .setTimestamp()
    .setFooter({
      text: client.footer,
    });

  if (config.client.disabledCMDS) {
    embed_builder.setDescription(
      'Command Usage is currently disabled! Please try again later!',
    );
    embed_builder.addField(
      'Reason:',
      'Command System is Buggy! Will be re-enabled as soon as possible!',
    );

    return message.reply({ embeds: [embed_builder] });
  }

  if (command.args && !args.length) {
    let reply = `You didn\'t provide any arguments`;

    if (command.usage) {
      reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
    }

    embed_builder.setDescription(reply);

    return message.reply({ embeds: [embed_builder] });
  }

  if (
    command.permissions &&
    !message.member.permissions.has(command.permissions)
  ) {
    embed_builder.setDescription(
      'You do not have the Necessary Permissions to execute this command!',
    );

    return message.reply({ embeds: [embed_builder] });
  }

  if (command.disabled) {
    embed_builder.setDescription(
      'Sorry, Seems like my Dev Team has Disabled this Command.',
    );

    return message.reply({ embeds: [embed_builder] });
  }

  if (command.ownerOnly && message.author.id !== config.mainOwner) {
    embed_builder.setDescription(
      `Woah, Only our Owner:  <@!${config.mainOwner}> can use this command!`,
    );

    return message.reply({ embeds: [embed_builder] });
  }

  if (command.headsOnly && !config.staff.heads.includes(message.author.id)) {
    embed_builder.setDescription(
      'Sorry, Only my Head Staff Team can use this Command.',
    );

    return message.reply({ embeds: [embed_builder] });
  }

  if (command.staffOnly) {
    let user = await UsersStorage.findOne({ userID: message.author.id });

    if (!user.staff) {
      embed_builder.setDescription(
        'Only the Infinity Bot Staff Team can execute this Command!',
      );

      return message.reply({ embeds: [embed_builder] });
    }
  }

  try {
    command.run(message, args, client, prefix);
  } catch (err) {
    const error_private = new MessageEmbed()
      .setAuthor('Internal Command Error')
      .setColor('RED')
      .setDescription(`ERROR: ${err}`)
      .addField('NOTE:', 'Please check the Server Logs for a full Error Stack')
      .setTimestamp()
      .setFooter({ text: client.footer });

    await sendErrorMessage({ embeds: [error_private] });

    await Console.SendLogs(`${err.stack}`, 'error');

    embed_builder.setDescription(
      'There was a Unexpected Error while executing that Command. Our Dev Team has been Notified but feel fry to Check any provided args and Try Again!',
    );

    return message.reply({ embeds: [embed_builder] });
  }
};
