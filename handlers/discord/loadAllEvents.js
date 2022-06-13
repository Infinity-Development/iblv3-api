const Console = require('@Handlers/logger/index');
const { readdirSync } = require('fs');

function loadAllEvents(client) {
  readdirSync('./discord/events/').forEach((file) => {
    const event = require(`../../discord/events/${file}`);
    var eventName = file.split('.')[0];
    Console.SendLogs(`Loading Client Event: ${eventName}`, 'event');
    client.on(eventName, event.bind(null, client));
  });
}

module.exports = loadAllEvents;
