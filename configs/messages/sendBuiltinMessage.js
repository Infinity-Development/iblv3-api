const { Client, Collection, Intents } = require('discord.js');
const Console = require('@Handlers/logger/index');
const config = require('@Configs/index');

const client = require('@Handlers/client/discord');

module.exports.sendBuiltinMessage = async (
  message,
  { guild, channel },
  req,
) => {
  if (!message)
    return Console.SendLogs(
      'Please define a message to send to the API Logs',
      'error',
    );

  if (!guild)
    return Console.SendLogs(
      'Please define a Guild to send the API Logs too',
      'error',
    );

  if (!channel)
    return Console.SendLogs(
      'Please define the Channel ID to send the API Logs too',
      'error',
    );
  else
    await client.guilds.cache
      .get(guild)
      .channels.cache.get(channel)
      .send(message);
};
