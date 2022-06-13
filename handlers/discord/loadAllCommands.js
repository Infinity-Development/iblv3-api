const Console = require('@Handlers/logger/index');
const { readdirSync } = require('fs');

function loadAllCommands(client) {
  readdirSync('./discord/commands/base').forEach((dir) => {
    const commandFiles = readdirSync(`./discord/commands/base/${dir}/`).filter(
      (f) => f.endsWith('.js'),
    );
    for (const file of commandFiles) {
      const command = require(`../../discord/commands/base/${dir}/${file}`);
      Console.SendLogs(
        `Loading Command: ${command.name} from Category: ${command.category}`,
        'cmd',
      );
      client.commands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        for (let i = 0; i < command.aliases.length; i++) {
          client.aliases.set(command.aliases[i], command);
        }
        Console.SendLogs(
          `Loading Command: ${command.name} from Category: ${command.category} with Aliases: ${command.aliases}`,
          'cmd',
        );
      }
    }
  });
}

module.exports = loadAllCommands;
