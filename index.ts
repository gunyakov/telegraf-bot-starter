import { Telegraf, session } from "telegraf";
import BotSession from "./middleware/session";
import BotContext from "./middleware/ctx";
import { ExtContext } from "./src/interface";
import Log from "./src/log";
import { BOT_TOKEN, MODE } from "./config";

import stages from "./scenes/stage";

// Create your bot and tell it about your context type
const bot = new Telegraf<ExtContext>(BOT_TOKEN[MODE]);
//Reg default telegraff session
bot.use(
  session({
    defaultSession: () => ({ userID: 0, chatID: 0, name: "", tgName: "" }),
  })
);
//Reg custom session to get users from DB
bot.use(BotSession);
//Extend Context with custom functions
bot.use(BotContext);
//Include stage with scenes and global actions
bot.use(stages.middleware());
bot.launch({ dropPendingUpdates: true }).catch((e) => {
  Log.error("MAIN", e);
});
Log.info("MAIN", "Started in development mode...");
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
