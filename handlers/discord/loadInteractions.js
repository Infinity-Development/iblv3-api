const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest');
const config = require('@Configs/index');
const { resolve } = require('path');
const { sync } = require('glob');

async function loadInteractions(guildId, client) {
  const intFile = await sync(resolve('../slash/**/*.js'));

  intFile.forEach((filepath) => {
    const File = require(filepath);

    if (!(File.prototype instanceof Interaction)) return;

    const interaction = new File();

    interaction.client = client;

    client.interactions.set(interaction.name, interaction);

    const res = new REST({ version: 10 }).setToken(config.client.disToken);

    res.put(Routes.applicationCommands(config.client.clientID), {
      body: interaction,
    });
  });
}

module.exports = loadInteractions;
