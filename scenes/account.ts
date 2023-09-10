import { Scenes } from "telegraf";
import { ExtContext } from "../src/interface";

import dbquery from "../DB/index";
import Queries from "../DB/queries";

const scene = new Scenes.BaseScene<ExtContext>("accountScene");

scene.enter((ctx) => {
  ctx.send("TXT_ACCOUNT_INFO", "account_keyboard", [
    ctx.session.tgName,
    ctx.session.chatID.toString(),
    ctx.session.name,
  ]);
});

scene.action("change_language", async (ctx) => {
  ctx.scene.enter("languageScene");
});

scene.action("delete_me", async (ctx) => {
  ctx.send("TXT_DELETE_ME", "confirm_keyboard");
});

scene.action("btn:confirm", async (ctx) => {
  let result = await dbquery(Queries.DELETE_USER, [ctx.session.chatID]);
  if (result) {
    //Reset user ID
    ctx.session.userID = 0;
    ctx.sendWC("TXT_DELETE_ME_OK", "user_reg_keyboard");
  } else {
    ctx.send("ERROR_DB_FAIL", "user_main_keyboard");
  }
});

scene.action("btn:cancel", async (ctx) => {
  ctx.sendWC("TXT_CANCEL", "user_main_keyboard");
});

export default scene;
