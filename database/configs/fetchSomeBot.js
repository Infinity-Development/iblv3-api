let BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');

module.exports.fetchSomeBot = async (botID) => {
  if (!botID)
    return Console.SendLogs(
      'Please provide a valid Bot ID to fetch from our Database',
      'error',
    );

  let bot = await BotsStorage.findOne({ botID: botID });

  return bot;
};
