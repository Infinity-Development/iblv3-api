## DB Tools
| Function                | Description                                   | Usage                                           | Example                                         |
|-------------------------|-----------------------------------------------|-------------------------------------------------|-------------------------------------------------|
| `checkUserVoted()`      | Check if User has Voted for a Bot             | `checkUserVoted(botID, userID)`                 | `checkUserVoted(815553000470478850, 510065483693817867)`  |
| `fetchAllBots()`        | Fetch all Bots in our Database                | `fetchAllBots()`                                | `fetchAllBots()`                                |
| `fetchApprovedBot()`    | Fetch a Approved Bot by ID                    | `fetchApprovedBot(BOT_ID)`                      | `fetchApprovedBot(815553000470478850)`          |
| `fetchBotByToken()`     | Fetch a Approved Bot by API Token             | `fetchBotByToken(API_TOKEN)`                    | `fetchBotByToken(SOME_INFINITY_API_TOKEN)`      |
| `fetchCertifiedBot()`   | Fetch a Certified Bot by ID                   | `fetchCertifiedBot(BOT_ID)`                     | `fetchCertifiedBot(815553000470478850)`         |
| `fetchSomeBot()`        | Fetch a Bot by ID                             | `fetchSomeBot(BOT_ID)`                          | `fetchSomeBot(815553000470478850)`              |
| `fetchSomeUser`         | Fetch a User by ID                            | `fetchSomeUser(USER_ID)`                        | `fetchSomeUser(510065483693817867)`             |
| `voteBanUser()`         | Ban a User from our Voting System (Not Staff) | `voteBanUser(USER_ID)`                          | `voteBanUser(510065483693817867)`               |