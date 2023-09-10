import { Scenes, Composer } from "telegraf";
import { ExtContext } from "../src/interface";
import { message } from "telegraf/filters";
import Titles from "../lang/index";
import { Lang } from "../src/enums";
import dbquery from "../DB/index";
import Queries from "../DB/queries";

const scene = new Scenes.WizardScene<ExtContext>(
  //Scene name
  "registrationScene",
  //Use composer to apply filters for your steps
  Composer.on(message("text"), async (ctx) => {
    if (!ctx.message.text) {
      return ctx.send("TXT_REG_STEP_1");
    } else {
      ctx.scene.session.nickname = ctx.message.text.replace(
        /[\u0800-\uFFFF]/g,
        ""
      );
      ctx.send("TXT_REG_STEP_2");
      return ctx.wizard.next();
    }
  }),
  Composer.on(message("text"), async (ctx) => {
    if (!ctx.message.text) {
      return ctx.send("TXT_REG_STEP_2");
    } else {
      ctx.scene.session.email = ctx.message.text.replace(
        /[\u0800-\uFFFF]/g,
        ""
      );
      let result = await dbquery(Queries.REG_USER, [
        ctx.session.chatID,
        ctx.scene.session.nickname,
        ctx.session.lang || Lang.en,
      ]);
      if (result) {
        ctx.send("TXT_REG_COMPLETED", "user_main_keyboard");
      } else {
        ctx.send("TXT_DB_ERROR", "user_reg_keyboard");
      }
      return ctx.scene.leave();
    }
  })
);

scene.enter((ctx) => {
  ctx.send("TXT_REG_STEP_1", "cancel_keyboard");
});

scene.hears(Titles.hearsTrigger("BUTTON_CANCEL"), (ctx) => {
  ctx.send("TXT_REG_EXIT_ENSURE", "confirm_keyboard");
});

scene.action("btn:confirm", async (ctx) => {
  ctx.deleteMessage();
  await ctx.send("TXT_REG_CANCELED", "user_reg_keyboard");
  ctx.scene.leave();
});

scene.action("btn:cancel", async (ctx) => {
  await ctx.deleteMessage();
  return ctx.send(`TXT_REG_STEP_${ctx.wizard.cursor + 1}`);
});

export default scene;
