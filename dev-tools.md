## Dev Tools

| Function                | Description             | Usage                   | Example                 |
|-------------------------|-------------------------|-------------------------|-------------------------|
| `sendBuiltinMessage()`  | Send a message to a Guild Channel  | `sendBuiltinMessage(MESSAGE, { guild: GUILD, channel: CHANNEL })`   | `sendBuiltinMessage('HI', guild: '1234567891011', channel: '1234567891011');`  |
| `sendPingMessage()`  | Send a message that pings a role      | `sendPingMessage(GUILD, ROLE, CHANNEL)`         | `sendPingMessage('1234567891011', '1234567891011', '1234567891011')`|
| `sendErrMessage()`  | Send a Error Log to the Dev Guild      | `sendErrMessage(MESSAGE)`   | `sendErrMessage('Woah, A unexpected error has occured');`                          |
| `sendInvMessage()`  | Send a Invite Log to the Dev Guild     | `sendInvMessage(MESSAGE)`   | `sendInvMessage('I joined a new guild yes');`                                      |
| `sendLogMessage()`  | Send a Console Log to the Dev Guild    | `sendLogMessage(MESSAGE)`   | `sendLogMessage('I am a useful log yes');`                                         |