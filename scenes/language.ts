import { Scenes } from "telegraf";
import { ExtContext } from "../src/interface";
import { Lang } from "../src/enums";

import dbquery from "../DB/index";
import Queries from "../DB/queries";

//Init base scene
const scene = new Scenes.BaseScene<ExtContext>("languageScene");
//Entrance event handler.
scene.enter((ctx) => {
  ctx.send("TXT_SELECT_LANGUAGE", "account_language");
});

scene.action(["language:ru", "language:en"], async (ctx) => {
  switch (ctx.getParameter()) {
    case "ru":
      ctx.setLocale(Lang.ru);
      break;
    default:
      ctx.setLocale(Lang.en);
      break;
  }
  //If user is present in DB
  if (ctx.session.userID) {
    //If request make properly to DB
    if (
      await dbquery(Queries.UPDATE_USER_LANG, [
        ctx.session.lang,
        ctx.session.userID,
      ])
    ) {
      ctx.sendWC("TXT_CHANGE_LANGUAGE", "user_main_keyboard");
    } else {
      ctx.send("ERROR_DB_FAIL");
    }
  } else {
    ctx.sendWC("TXT_CHANGE_LANGUAGE", "user_reg_keyboard");
  }
  ctx.scene.leave();
});

export default scene;
