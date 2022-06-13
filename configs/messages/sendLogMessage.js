const Logger = require('@Handlers/logger/customLogger');
const Config = require('../../config');

module.exports.sendLogMessage = async (message, req) => {
  const client = require('@RootDir/index');

  if (!message)
    return Logger.log(
      'Please define a message to send to the API Logs.',
      'error',
    );
  else {
    await client.guilds.cache
      .get(Config.devGuild)
      .channels.cache.get(Config.apiLogs)
      .send(message);
  }
};
