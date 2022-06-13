const VotesStorage = require('@Models/models/votes');
const UsersStorage = require('@Models/models/users');
const BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');

module.exports.checkUserVoted = async ({ bot, user }) => {
  if (!bot)
    return Console.SendLogs(
      'Please provide a valid Bot ID to fetch from our Database',
      'error',
    );

  if (!user)
    return Console.SendLogs(
      'Please provide a valid User ID to fetch from our Database',
      'error',
    );

  let votes = await VotesStorage.findOne({ botID: bot, userID: user });

  return votes;
};
