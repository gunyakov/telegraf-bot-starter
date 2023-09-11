# telegraf-bot-starter

This is an example of a telegraph bot inclide:

- Registration wizard scene.
- Account base scene.
- Language change base scene.
- Mysql adapter for MySql2 to simplify DB communication.
- Keyboards constructor for easy keyboard processing
- Multilingual support

For any teaching or development purposes.

To run the bot, import the data from `DB.sql` into the database and set the correct configuration in `config.ts`

## Install

```
git clone https://github.com/gunyakov/telegraf-bot-starter

cd telegraf-bot-starter

npm install

npm run start
```

## Version Log

#### Sep 12, 2023 v2.2.0

- Reg scene validator
- Improve getText for language handler to supply not only a key, but also array of keys.

#### Sep 11, 2023 v2.1.1

- Errors resolving
- Code improvments

#### Sep 10, 2023 v2.1.0

- Add Language selection scene
- Refactoring of keyboards making algoritm.

#### Sep 9, 2023 v2.0.0

- The bot has been rewritten using TypeScript.
- Support for version 4.13.1 of Telegraf.

#### Dec 3, 2022 v1.0.0

- Init release
