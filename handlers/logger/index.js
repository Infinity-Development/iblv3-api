const chalk = require('chalk');
const moment = require('moment');

module.exports = class Console {
  static SendLogs(content, type = 'log') {
    const date = `${moment().format('DD-MM-YYYY hh:mm:ss')}`;

    switch (type) {
      case 'log': {
        return console.log(
          `[Logs] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgBlue(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'warn': {
        return console.log(
          `[Warning] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgYellow(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'error': {
        return console.log(
          `[Error] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgRed(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'debug': {
        return console.log(
          `[Debug] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgGreen(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'cmd': {
        return console.log(
          `[Cmd] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgWhite(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'event': {
        return console.log(
          `[Event] - Date: ${chalk.gray(date)} | Type: ${chalk.black.bgWhite(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'ready': {
        return console.log(
          `[Ready] - Date: ${chalk.gray(
            date,
          )} | Type: ${chalk.black.bgBlueBright(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'router': {
        return console.log(
          `[Router] - Date: ${chalk.gray(
            date,
          )} | Type: ${chalk.black.bgBlueBright(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'client': {
        return console.log(
          `[Client] - Date: ${chalk.gray(
            date,
          )} | Type: ${chalk.black.bgBlueBright(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      case 'start': {
        return console.log(
          `[Start-Up] - Date: ${chalk.gray(
            date,
          )} | Type: ${chalk.black.bgBlueBright(
            type.toUpperCase(),
          )} | Message: ${content}`,
        );
      }

      default:
        throw new TypeError(
          '[Infinity API] Logger Type must be either warn, debug, log, ready, cmd or error',
        );
    }
  }
};
