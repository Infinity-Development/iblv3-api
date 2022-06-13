# Rowlet
Fullish-Stack REST API made using Fastify, Mongoose, Discord.js and Redis for Ratelimits.

> This repo is no longer maintained as we have moved away from this source code for our New [GO API]()

---

## Getting Started
1. Download or Clone this Repo
2. Extract the Files to a Destination of your choice
3. Open the Code in Visual Studio or any Text Editor
4. Make sure you have `Node ^v16` installed on your PC
5. Open and configure the [Client Config](./configs/index.js).
8. Run the terminal command: `npm install`
9. Run the terminal command: `npm run dev`

**NOTE:** Please only use the `npm start` command in a Production Environment.

---

## Config Setup
| Value                       | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| prefix                      | Prefix for the Bot Commands                              |
| disabledCMDS                | Disable Bot Commands (true or false)                     |
| clientID                    | Discord CLient/Bot ID                                    |
| disToken                    | Discord Client/Bot Token                                 |
| invite                      | Discord Client/Bot Invite (if public)                    |
| server                      | Invite to your Support Server                            |
| redis                       | Redis Database Connection String                         |
| mongo                       | Mongoose Database Connection String                      |
| port                        | PORT to use for your Web Server                          |
| domain                      | Your domain (ex: https://api.domain.com)                 |
| devGuild                    | ID to your Developer Only Guild                          |
| staffGuild                  | ID to your Staff Only Guild                              |
| mainGuild                   | ID to your Main Guild                                    |
| apiLink                     | Domain for your API (same as "domain")                   |
| docsLink                    | Domain for your Documentation Site                       |
| webLink                     | Domain for your Main Website                             |
| status                      | Domain for your Status Page                              |
| headDev                     | Head Developer Role ID (staff)                           |
| baseDev                     | Base Developer Role ID (staff)                           |
| apiLogs                     | Channel ID to Log Events and Startup                     |
| errLogs                     | Channel ID to Log Errors                                 |
| invLogs                     | Channel ID to Log Bot Invites                            |
| team                        | Array of Staff Member ID(s)                              |
| heads                       | Array of Head Staff ID(s)                                |



---

## File Structure
This Project is divided into multiple directories which will be explained here. Please follow and respect this layout when making changes.

```shell
# Base Files
 ├── handlers

# Server Files
 ├── server
  
# Client Files
 ├── discord

# Database Files
 ├── database

# Config Files
 ├── configs

```

---

## Package Layout
This project utilizes the `module-alias` package to help us clean up imports. Please check the bottom of the [Package.json](./package.json) for a full list of module names

### Calling a Package/Directory
1. Find the Directory you want to use in our Package.json
2. Import it using the Module Alias Name (Example Below)

```js
const VotesStorage = require('@Models/models/votes');
const UsersStorage = require('@Models/models/users');
const BotsStorage = require('@Models/models/bots');
const Console = require('@Handlers/logger/index');
```

---

## Available Tools
- Please read [dev-tools](./dev-tools.md) and [db-tools](./db-tools.md)
