const { Composer, Scenes: { BaseScene } } = require('telegraf')

const scene = new BaseScene('accountScene')

const Title = require("../Language/index.js");

const query = require("../DB/index.js");

scene.enter(ctx => {
    ctx.send('TXT_ACCOUNT_INFO', "account_keyboard", [ctx.session.name, ctx.session.chatID]);
})

scene.action('change_language', async ctx => {
    ctx.send('TXT_SELECT_LANGUAGE', "account_language");
});

scene.action('delete_me', async ctx => {
    ctx.send('TXT_DELETE_ME', "confirm_keyboard");
});

scene.action('delete_me_confirm', async ctx => {
  if(await Users.deleteMe(ctx.session.chatID)) {
    ctx.send('TXT_DELETE_ME_OK', "user_reg_keyboard");
  }
  else {
    ctx.send('ERROR_DB_FAIL', "user_main_keyboard");
  }
});

scene.action('delete_me_cancel', async ctx => {
    ctx.send('TXT_CANCEL', "user_main_keyboard");
});

scene.action('language_ru', async ctx => {
    if(ctx.session.lang !== "ru") {
      if(await Users.setLanguage(ctx.session.chatID, "ru")) {
        ctx.send("TXT_CHANGE_LANGUAGE", "user_main_keyboard");
      }
      else {
        ctx.send("ERROR_DB_FAIL");
      }
    }
    else {
      ctx.send("TXT_CHANGE_LANGUAGE");
    }
});

scene.action('language_en', async ctx => {
  if(ctx.session.lang !== "en") {
    if(await Users.setLanguage(ctx.session.chatID, "en")) {
      ctx.send("TXT_CHANGE_LANGUAGE", "user_main_keyboard");
    }
    else {
      ctx.send("ERROR_DB_FAIL");
    }
  }
  else {
    ctx.send("TXT_CHANGE_LANGUAGE");
  }
});

module.exports = scene
