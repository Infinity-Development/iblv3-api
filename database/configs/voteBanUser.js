const UsersStorage = require('@Models/models/users');
const Console = require('@Handlers/logger/index');

module.exports.voteBanUser = async (userID) => {
  if (!userID)
    return Console.SendLogs(
      'Please provide a User ID to fetch from our Database',
      'error',
    );

  let user = await UsersStorage.findOne({ userID: userID });

  if (user.staff)
    return Console.SendLogs(
      'Sorry, Unable to Vote Ban any Active Members of the IBL Staff',
      'error',
    );
  else if (user.vote_banned)
    return Console.SendLogs(
      'Sorry, That user has already been Vote Banned!',
      'error',
    );
  else await UsersStorage.updateOne({ userID: userID, vote_banned: true });

  return Console.SendLogs(`Okay, ${userID} has been Vote Banned Successfully!`);
};
