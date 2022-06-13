const Console = require('@Handlers/logger/index');
const { readdirSync } = require('fs');

function loadSlashCommands(client) {
  const slashCmds = [];

  readdirSync('./discord/commands/slash/').forEach(async (dir) => {
    const slashCommandFile = readdirSync(
      `./discord/commands/slash/${dir}`,
    ).filter((files) => files.endsWith('.js'));
    for (const file of slashCommandFile) {
      const slashCommand = require(`../../discord/commands/slash/${dir}/${file}`);
      if (!slashCommand.name)
        return Console.SendLogs('Application Command Name is required!', 'cmd');
      if (!slashCommand.description)
        return Console.SendLogs(
          'Application Command Description is required!',
          'cmd',
        );
      client.slash.set(slashCommand.name, slashCommand);
      Console.SendLogs(
        `Loaded Slash Command: ${slashCommand.name} Successfully!`,
        'cmd',
      );
      slashCmds.push(slashCommand);
    }
  });
}

module.exports = loadSlashCommands;
