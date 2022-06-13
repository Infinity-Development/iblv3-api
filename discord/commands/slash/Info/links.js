const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');

const links = new MessageEmbed();
const private = new MessageEmbed();
const public = new MessageEmbed();

module.exports = {
  name: 'links',
  description: 'Display the Bot Links.',
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,
  disabled: false,

  run: async (client, interaction, args) => {
    try {
      let btn = new MessageButton()
        .setLabel('Bot Invite')
        .setURL(config.client.support.invite)
        .setStyle(5);
      let btn2 = new MessageButton()
        .setLabel('Website')
        .setURL(config.links.webLink)
        .setStyle(5);
      let btn3 = new MessageButton()
        .setLabel('Discord')
        .setURL(config.client.support.server)
        .setStyle(5);
      let btn4 = new MessageButton()
        .setLabel('Documentation')
        .setURL(config.links.docsLink)
        .setStyle(5);
      let ButtonsRow = new MessageActionRow().addComponents(
        btn,
        btn2,
        btn3,
        btn4,
      );
      links.setTitle('Useful Links');
      links.setColor(client.color);
      links.setThumbnail(client.logo);
      links.setDescription('Below is a list of some Helpful Links!');
      links.setFooter({
        text: client.footer,
      });
      return interaction.followUp({
        embeds: [links],
        components: [ButtonsRow],
      });
    } catch (err) {
      public.setTitle('Internal Slash Command Error');
      public.setColor('RED');
      public.setDescription(
        'An error has occurred with this command. My Dev Team has been notified of the incident!',
      );
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
