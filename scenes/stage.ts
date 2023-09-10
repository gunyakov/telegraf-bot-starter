import { Scenes } from "telegraf";
import Titles from "../lang/index";

import { ExtContext } from "../src/interface";
import onlyAuthUsers from "../middleware/authusers";

import accountScene from "./account";
import registrationScene from "./registration";
import languageScene from "./language";

const stages = new Scenes.Stage<ExtContext>(
  [accountScene, registrationScene, languageScene]
);
//Language changing available for all users
stages.hears(Titles.hearsTrigger("BUTTON_LANGUAGE"), async (ctx) => {
  ctx.scene.enter("languageScene");
});
//Registration is available for all users
stages.hears(Titles.hearsTrigger("BUTTON_REGISTRATION"), async (ctx) => {
  //If user isnt register, enter register scene
  if (!ctx.session.userID) ctx.scene.enter("registrationScene");
  //If user register, skip registration.
  else ctx.send("TXT_REG_NO_NEED", "user_main_keyboard");
});
//Account enter is only for Auth Users.
stages.hears(Titles.hearsTrigger("BUTTON_ACCOUNT"), onlyAuthUsers, (ctx) =>
  ctx.scene.enter("accountScene")
);
//Reg bot /start function
stages.start(async (ctx) => {
  if (ctx.session.userID) {
    ctx.send("TXT_WELCOME_BACK", "user_main_keyboard", [
      ctx.session?.name || "NoName",
    ]);
  } else {
    ctx.send("TXT_REGISTRATION", "user_reg_keyboard");
  }
});

export default stages;
