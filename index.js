#!/usr/bin/env node
const { Telegraf, session } = require('telegraf');

global.Users = require("./Middleware/users.js");
global.Log = require("./src/log.js");

const ctx = require('./Middleware/ctx')
const botListener = require('./src/listener');
const stages = require('./Scenes/stage');
const UserSession = require("./Middleware/user_session.js");

const { BOT_TOKEN, MODE } = require('./config.js');

const bot = new Telegraf(BOT_TOKEN[MODE]);

(async () => {

  Object.assign(bot.context, ctx);
  bot.use(session());
  bot.use(UserSession);
  bot.use(botListener);
  bot.use(stages);

  if(MODE === 'prod') {

		const { SERVER_IP, WEBHOOK_PORT } = require("./config.js");
		const { readFileSync } = require('fs')

		const key = readFileSync('Certs/PRIVATE.key')
		const cert = readFileSync('Certs/PUBLIC.pem')
		const webhook_target = `https://${SERVER_IP}:${WEBHOOK_PORT}/${BOT_TOKEN}`
		const webhook_options = { certificate: { source: 'Certs/PUBLIC.pem' }, ip_address: SERVER_IP, allowed_updates, drop_pending_updates: true }

		await bot.telegram.setWebhook(webhook_target, webhook_options)
		await bot.startWebhook(`/${BOT_TOKEN}`, { key, cert }, WEBHOOK_PORT)	*/

    bot.launch({ dropPendingUpdates: false});

		Log.info("MAIN", 'Started in production mode...')

	} else {

		bot.launch({ dropPendingUpdates: true});
		Log.info("MAIN", 'Started in development mode...')
	}

})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
