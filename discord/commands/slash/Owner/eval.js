const { MessageEmbed } = require('discord.js');
const Console = require('@Handlers/logger/index');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const { post } = require('node-superfetch');

function clean(text) {
  if (typeof text === 'string')
    return text
      .replace(/`/g, '`js' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  else return text;
}

const embed2 = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'eval',
  description: 'Evaluate some Code (Typically Javascript)',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: true,
  disabled: false,
  options: [
    {
      name: 'code',
      type: 'STRING',
      required: true,
      description: 'Please provide a some code.',
    },
  ],
  run: async (client, interaction, args) => {
    try {
      let code = interaction.options.getString('code');
      let evaled;
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
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
      embed2.setTitle('Evaluation Results');
      embed2.setColor(client.color);
      embed2.setThumbnail(client.logo);
      embed2.addField('📥 | **Input:**', `${code}`);
      if (output.length > 1024) {
        const { body } = await post('https://code.toxicdev.me/documents').send(
          output,
        );
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
      return interaction.followUp({
        embeds: [embed2],
      });
    } catch (err) {
      public.setTitle('Internal Slash Command Error');
      public.setColor('RED');
      public.setDescription(
        'An error has occurred with this command. My Dev Team has been notified of the incident!',
      );
      public.setTimestamp();
      public.setFooter({ text: client.footer });

      private.setTitle('Internal Slash Command Error');
      private.setColor('RED');
      private.setDescription(`\`\`\`yaml\n${err.stack}\`\`\``);
      private.setTimestamp();

      await interaction.followUp({ embeds: [public] });
      await sendErrorMessage({ embeds: [private] });

      return Console.SendLogs(`${err.stack}`, 'error');
    }
  },
};
