const UsersStorage = require('@Models/models/users');
const Console = require('@Handlers/logger/index');

module.exports.fetchSomeUser = async (userID) => {
  if (!userID)
    return Console.SendLogs(
      'Please provide a valid User ID to fetch from our System',
      'error',
    );

  let user = await UsersStorage.findOne({ userID: userID });

  if (!user)
    return Console.SendLogs(
      'Unable to find that User in our System, Please make sure the ID is Correct',
      'error',
    );

  return user;
};
