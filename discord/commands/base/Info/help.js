const {
  MessageEmbed,
  MessageSelectMenu,
  MessageButton,
  MessageActionRow,
} = require('discord.js');
const { sendErrorMessage } = require('@Configs/messages/sendErrorMessage');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');
const { readdirSync } = require('fs');

module.exports = {
  name: 'help',
  category: 'Info',
  disabled: false,
  description: 'Displays my Help Message and a List of Commands!',
  aliases: ['h', 'list', 'helpme', 'cmds', 'commands'],
  permissions: [],
  ownerOnly: false,
  headsOnly: false,
  staffOnly: false,

  run: async (message, args, client) => {
    try {
      const categories = readdirSync(`${__dirname}/../../../commands/base`);
      let embed = new MessageEmbed()
        .setAuthor({
          name: `${client.user.username} - Help Menu`,
          iconURL: client.logo,
        })
        .setColor(client.color)
        .setDescription(
          `>>> My prefix is \`${config.client.prefix}\`\n Use the menu to view a list of commands based on their category!`,
        )
        .setThumbnail(client.logo)
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      const emoji = {
        Api: '☕',
        Info: 'ℹ️',
        Owner: '👨‍🔧',
        Staff: '👑',
      };
      let raw = new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .setCustomId('help-menu')
          .setPlaceholder('Click to see my command categories')
          .addOptions([
            categories.map((cat) => {
              return {
                label: `${cat[0].toUpperCase() + cat.slice(1)}`,
                value: cat,
                emoji: emoji[cat],
                description: `Click to See Commands for: ${cat}`,
              };
            }),
          ]),
      ]);
      let raw2 = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId('home')
          .setLabel('Home')
          .setStyle('PRIMARY')
          .setEmoji('🏘️'),
      ]);
      message
        .reply({
          embeds: [embed],
          components: [raw, raw2],
        })
        .then(async (msg) => {
          let filter = (i) => i.user.id === message.author.id;
          let colector = await msg.createMessageComponentCollector({
            filter: filter,
          });
          colector.on('collect', async (i) => {
            if (i.isButton()) {
              if (i.customId === 'home') {
                await i.deferUpdate().catch((e) => {});

                msg
                  .edit({
                    embeds: [embed],
                  })
                  .catch((e) => {});
              }
            }
            if (i.isSelectMenu()) {
              if (i.customId === 'help-menu') {
                await i.deferUpdate().catch((e) => {});
                let [directory] = i.values;
                let aa = new MessageEmbed()
                  .setTitle(`Commands for: ${directory}`)
                  .setColor(client.color)
                  .setDescription(
                    `>>> ${client.commands
                      .filter((cmd) => cmd.category === directory)
                      .map((cmd) => {
                        return [`\`${config.client.prefix}${cmd.name}\``].join(
                          ' ',
                        );
                      })
                      .join('\n')}`,
                  )
                  .setFooter({
                    text: client.footer,
                  });
                msg.edit({
                  embeds: [aa],
                });
              }
            }
          });
        });
    } catch (err) {
      const public = new MessageEmbed()
        .setTitle('Internal Server Error')
        .setDescription(
          'An error has occurred with this command. My Dev Team has been notified of this incident.',
        )
        .setColor('RED')
        .setFooter({
          text: client.footer,
        });
      await message.reply({
        embeds: [public],
      });
      const private = new MessageEmbed()
        .setTitle('Internal Server Error')
        .setColor('RED')
        .setDescription(`\`\`\`yaml\n${err.stack}\`\`\``)
        .setTimestamp()
        .setFooter({
          text: client.footer,
        });
      await sendErrorMessage({
        embeds: [private],
      });
      return Console.SendLogs(`${err.stack}`, 'error');
    }
  },
};
