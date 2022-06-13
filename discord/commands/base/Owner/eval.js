const { MessageEmbed } = require('discord.js');
const { fetchSomeBot } = require('@Models/configs/fetchSomeBot');
const { fetchSomeUser } = require('@Models/configs/fetchSomeUser');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { post } = require('node-superfetch');

function clean(text) {
  if (typeof text === 'string')
    return text
      .replace(/`/g, '`js' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  else return text;
}

module.exports = {
  name: 'eval',
  category: 'Owner',
  disabled: false,
  description: 'Evaluate some Code (Typically Javascript)',
  usage: '<mention/id>',
  args: false,
  aliases: ['js', 'code'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,

  run: async (message, args, client) => {
    try {
      if (!args[0]) {
        const embed = new MessageEmbed()
          .setTitle('Invalid Args')
          .setColor('RED')
          .setDescription('Please provide some code to evaluate')
          .setFooter({
            text: client.footer,
          });
        return message.reply({
          embeds: [embed],
        });
      } else {
        let code = args.join(' ');
        let evaled;
        if (typeof evaled !== 'string')
          evaled = require('util').inspect(evaled);
        if (
          code.includes(`SECRET`) ||
          code.includes(`TOKEN`) ||
          code.includes(`process.env`) ||
          code.includes(`client.token`) ||
          code.includes(`client.config`) ||
          code.includes(`MONGOOSE`) ||
          code.includes(`MONGO`)
        ) {
          evaled =
            "Hmmm. Excuse me for one second... Yeah sorry looks like this just isn't happening... Sorry chief!";
        } else {
          evaled = eval(code);
        }
        let output = clean(evaled);
        const embed2 = new MessageEmbed();
        embed2.setTitle('Evaluation Results');
        embed2.setColor(client.color);
        embed2.setThumbnail(client.logo);
        embed2.addField('📥 | **Input:**', `${code}`);
        if (output.length > 1024) {
          const { body } = await post(
            'https://code.toxicdev.me/documents',
          ).send(output);
          embed2.addField(
            '📤 | **Output:**',
            `https://code.toxicdev.me/${body.key}`,
          );
        } else {
          embed2.addField('📤 | **Output:**', '```js\n' + output + '```');
        }
        embed2.setFooter({
          text: client.footer,
        });
        return message.reply({
          embeds: [embed2],
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
