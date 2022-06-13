const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

module.exports.sendInviteMessage = async (message, req) => {
  const client = require('@Handlers/client/discord');

  if (!message)
    return Console.SendLogs(
      'Please define a message to send to the Invite Logs.',
      'error',
    );
  else {
    await client.guilds.cache
      .get(config.guilds.devGuild)
      .channels.cache.get(config.logs.invLogs)
      .send(message);
  }
};
