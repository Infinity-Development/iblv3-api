const { MessageEmbed, MessageSelectMenu } = require('discord.js');
const loadInteractions = require('@Handlers/discord/loadInteractions');
const { sendBuiltinMessage } = require('@Configs/messages/sendBuiltinMessage');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

const missing_perms = new MessageEmbed();
const private_err1 = new MessageEmbed();
const private_err2 = new MessageEmbed();
const owner_only = new MessageEmbed();
const staff_only = new MessageEmbed();
const heads_only = new MessageEmbed();
const disabled = new MessageEmbed();

module.exports = async (client, interaction) => {
  try {
    if (interaction.isCommand()) {
      await interaction.deferReply();

      const slash = client.slash.get(interaction.commandName);

      if (!slash) return;
      else {
        let staff_check = await fetchSomeUser(interaction.member.id);

        if (
          slash.permissions &&
          !interaction.member.permissions.has(slash.permissions)
        ) {
          missing_perms.setTitle('Invalid Permissions');
          missing_perms.setColor('RED');
          missing_perms.setDescription(
            'You do not have the necessary Permission(s) to use this Command!',
          );
          missing_perms.setTimestamp();

          return interaction.editReply({ embeds: [missing_perms] });
        } else if (
          slash.ownerOnly &&
          interaction.member.id !== '510065483693817867'
        ) {
          owner_only.setTitle('You wish you could!');
          owner_only.setColor('RED');
          owner_only.setDescription(
            'Woah, Only my Owner can use this Command.',
          );
          owner_only.setTimestamp();

          return interaction.editReply({ embeds: [owner_only] });
        } else if (slash.staffOnly && !staff_check.staff) {
          staff_only.setTitle('Invalid Permissions');
          staff_only.setColor('RED');
          staff_only.setDescription(
            'This Command is locked to Active Members of the Infinity Bot List Staff!',
          );
          staff_only.setTimestamp();

          return interaction.editReply({ embeds: [staff_only] });
        } else if (
          slash.headsOnly &&
          !config.staff.heads.includes(interaction.member.id)
        ) {
          heads_only.setTitle('Invalid Permissions');
          heads_only.setColor('RED');
          heads_only.setDescription(
            'This Command is locked to Active Members of the Infinity Bot List Management Team!',
          );
          heads_only.setTimestamp();

          return interaction.editReply({ embeds: [heads_only] });
        } else if (slash.disabled) {
          disabled.setTitle('Command Disabled');
          disabled.setColor('RED');
          disabled.setDescription(
            'Sorry but it seems like my Dev Team has Disabled this Command!',
          );
          disabled.addField(
            'Possible Reasons:',
            'Buggy, Broken, or In Development',
          );
          disabled.setTimestamp();

          return interaction.editReply({ embeds: [disabled] });
        } else {
          try {
            await slash.run(client, interaction);
          } catch (e) {
            private_err1.setAuthor({ name: 'Internal Command Error' });
            private_err1.setColor('RED');
            private_err1.setDescription(`\`\`\`yaml\n${e.stack}\`\`\``);
            private_err1.setTimestamp();

            await sendErrorMessage({ embeds: [private_err1] });

            return Console.SendLogs(`${e.stack}`, 'error');
          }
        }
      }
    }
  } catch (err) {
    private_err2.setAuthor({ name: 'Internal Command Error' });
    private_err2.setColor('RED');
    private_err2.setDescription(`\`\`\`yaml\n${err.stack}\`\`\``);
    private_err2.setTimestamp();

    await sendErrorMessage({ embeds: [private_err2] });

    return Console.SendLogs(`${err.stack}`, 'error');
  }
};
