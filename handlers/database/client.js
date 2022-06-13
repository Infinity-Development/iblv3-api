const mongoose = require('mongoose');
const settings = require('@Configs/index');
const Console = require('@Handlers/logger/index');

if (!settings.database.mongo)
  Console.SendLogs(
    'Please define the Mongoose Connection String in the Config!',
    'error',
  );

module.exports.DatabaseClient = async (URI) => {
  await mongoose
    .connect(URI, {
      family: 4,
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      Console.SendLogs('Connected to the Mongo Successfully', 'ready');
    })
    .catch((err) => {
      Console.SendLogs(
        `Error Occurred while Connecting to Mongo: ${err.stack}`,
        'error',
      );
    });

  mongoose.connection.on('connected', () => {
    Console.SendLogs(
      `Database Connection has been established successfully!`,
      'ready',
    );
  });

  mongoose.connection.on('err', () => {
    Console.SendLogs(
      `Error occurred while establishing a Connection with Mongoose`,
      'error',
    );
  });

  mongoose.connection.on('disconnected', () => {
    Console.SendLogs(
      `Connection to the Database has been dropped... Please wait!!!`,
      'event',
    );
  });
};
