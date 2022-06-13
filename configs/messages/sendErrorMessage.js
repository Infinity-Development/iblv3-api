const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

module.exports.sendErrorMessage = async (message, req) => {
  const client = require('@Handlers/client/discord');

  if (!message)
    return Console.SendLogs(
      'Please define a Message to send to the Error Logs Channel',
      'error',
    );
  else
    await client.guilds.cache
      .get(config.guilds.devGuild)
      .channels.cache.get(config.logs.errLogs)
      .send(message);
};
