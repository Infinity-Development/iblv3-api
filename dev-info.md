# Welcome
If you are reading this you are most likely a Dev for IBL who is looking for some help. You have come to the right place!

---

## Getting Started
1. Download or Clone this Repo
2. Extract the Files to a Destination of your choice
3. Open the Code in Visual Studio or any Text Editor
4. Make sure you have `Node ^v16` installed on your PC
5. Open the [Client Config](./configs/index.js).
6. Remove the Comments for the Dev Bot Info (Ex: `//clientID: '826741345828732968', // Dev Bot`) Remove the "//" at the beginning
7. Comment out the Main Bots info to avoid any conflicts (Ex: `clientID: '818419115068751892', // Main Bot`) add a "//" at the beginning
8. Run the terminal command: `npm install`
9. Run the terminal command: `npm run dev`

**NOTE:** Please only use the `npm start` command in a Production Environment.


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

## Available Dev Tools
- Please read [dev-tools](./dev-tools.md) and [db-tools](./db-tools.md)


