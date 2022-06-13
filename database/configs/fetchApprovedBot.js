let BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');

module.exports.fetchApprovedBots = async (botID) => {
  if (!botID)
    return Console.SendLogs(
      'Please provide a valid Bot ID to fetch from our Database',
      'error',
    );

  let bot = await BotsStorage.findOne({ botID: botID });

  if (!bot)
    return Console.SendLogs(
      'Someone attempted to fetch a bot from our list but it does not appear to be approved!',
      'error',
    );

  return bot;
};
