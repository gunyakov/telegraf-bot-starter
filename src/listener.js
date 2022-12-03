const { Telegraf, Composer } = require('telegraf')

const chatHandler = new Composer()

//Here we put actions what will be 'GLOBAL' for all scenes
chatHandler.start(async ctx => {
  return ctx.send("TXT_WELCOME_BACK", "user_main_keyboard", [ctx.session.name]);
});

module.exports = Telegraf.chatType("private", chatHandler);
