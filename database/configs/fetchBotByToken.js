const BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');

module.exports.fetchBotByToken = async (authHeader) => {
  if (!authHeader)
    return Console.SendLogs(
      'Please provide a valid Auth Token for the bot you want to fetch!',
      'error',
    );

  let bot = await BotsStorage.findOne({ token: authHeader, type: 'approved' });

  if (!bot)
    return Console.SendLogs(
      'Unable to find a bot in our system which has the Provided Auth Token',
      'error',
    );

  return bot;
};
