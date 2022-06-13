const BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');

module.exports.fetchCertifiedBot = async (botID) => {
  if (!botID)
    return Console.SendLogs(
      'Please fetch a valid Certified Bot ID to fetch from our System!',
      'error',
    );

  let bot = await BotsStorage.findOne({ botID: botID, certified: true });

  if (!bot)
    return Console.SendLogs(
      'Unable to find a Certified Bot in our System with the ID Provided!',
      'error',
    );

  return bot;
};
