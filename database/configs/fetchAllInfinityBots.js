const BotsStorage = require('@Models/models/bots');

module.exports = async (client) => {
  const bots = await BotsStorage.find(
    {},
    {
      unique_clicks: 0,
      token: 0,
      webAuth: 0,
      webURL: 0,
      claimed: 0,
      claimedBy: 0,
    },
  );

  return bots.filter((bot) => bot.type !== 'denied');
};
