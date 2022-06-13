require('module-alias/register');

const { Client, Collection, Intents } = require('discord.js');

const client = new Client({
  shards: 'auto',
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  allowedMentions: {
    parse: ['roles', 'users', 'everyone'],
    repliedUser: false,
  },
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

module.exports = client;

const mongoose = require('mongoose');

const loadAllCommands = require('@Handlers/discord/loadAllCommands');
const loadAllEvents = require('@Handlers/discord/loadAllEvents');
const loadSlashCommands = require('@Handlers/discord/loadSlashCommands');
const loadInteractions = require('@Handlers/discord/loadInteractions');

/**
 * LOAD THE CUSTOM LOGGER
 */
client.logger = require('@Handlers/logger/index');
client.config = require('@Configs/index');
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.category = new Collection();
client.limits = new Map();

client.color = '#E9F535';
client.logo =
  'https://cdn.discordapp.com/attachments/653733403841134600/906287522068439080/imageedit_3_3710163012.png';
client.footer =
  'Bot Version: 4.2.0 • © Copyright 2020-2022 - Infinity Bot List';

/**
 * LOAD THE MONGO ERROR HANDLER
 */
mongoose.connection.on('connected', () => {
  console.log(
    '[IBL-Mongo-Logger] - Connected to the Database Successfully with no Errors!',
  );
});
mongoose.connection.on('err', () => {
  console.log(
    `[IBL-Mongo-Logger] - Mongoose Connection Error:\n Stack: ${error.stack}`,
    'error',
  );
});
mongoose.connection.on('disconnected', () => {
  console.log('[IBL-Mongo-Logger] - Mongoose has been Disconnected!');
});

/**
 * LOAD THE CLIENT ERROR HANDLER
 */
client.on('disconnect', () => {
  console.log(
    '[IBL-Client-Logger] - Client is Disconnecting from the Discord API!',
  );
});
client.on('reconnecting', () => {
  console.log(
    '[IBL-Client-Logger] Client is Reconnecting to the Discord API, Please wait!',
  );
});
client.on('warn', (error) => {
  console.log(
    `[IBL-Client-Logger] - Warning: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});
client.on('error', (error) => {
  console.log(
    `[IBL-Client-Logger] - Error: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});

/**
 * LOAD THE PROCESS ERROR HANDLER
 */
process.on('unhandledRejection', (error) => {
  console.log(
    `[IBL-Client-Logger] - Unhandled_Rejection: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});
process.on('uncaughtException', (error) => {
  console.log(
    `[IBL-Client-Logger] - Uncaught_Exception: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});

/**
 * LOAD ALL THE COMMANDS AND EVENTS
 */
loadAllCommands(client);
loadAllEvents(client);
loadInteractions();
loadSlashCommands(client);

client.login(client.config.client.disToken);
