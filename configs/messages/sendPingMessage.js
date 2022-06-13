const Logger = require('@Handlers/logger/customLogger');
const Config = require('../../config');

module.exports.sendPingMessage = async (guild, role, channel, req) => {
  const client = require('@RootDir/index');

  if (!guild)
    return Logger.log(
      'Please define a Guild to send the Ping Message to',
      'error',
    );
  if (!channel)
    return Logger.log(
      'Please define a Channel to send the Ping Message to',
      'error',
    );
  if (!role)
    return Logger.log('Please define a Role to Ping in the message', 'error');
  else {
    let role = await client.guilds.cache.get(guild).roles.cache.get(role);
    let chan = await client.guilds.cache.get(guild).channels.cache.get(channel);

    return chan.send(`${role}`);

    Logger.log('Ping Message was executed successfully');
  }
};
