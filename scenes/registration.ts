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
    console.log("Step 1");
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
    console.log("Step 2");
    if (!ctx.message.text) {
      return ctx.send("TXT_REG_STEP_2");
    } else {
      ctx.scene.session.email = ctx.message.text.replace(
        /[\u0800-\uFFFF]/g,
        ""
      );
      // let result = await dbquery(Queries.REG_USER, [
      //   ctx.session.chatID,
      //   ctx.scene.session.nickname,
      //   ctx.session.lang || Lang.en,
      // ]);
      if (true) {
        ctx.send("TXT_REG_COMPLETED");
      } else {
        ctx.send("TXT_DB_ERROR");
      }
      return ctx.scene.leave();
    }
  })
);

scene.enter((ctx) => {
  console.log("Reg scene enter");
  ctx.send("TXT_REG_STEP_1", "cancel_keyboard");
});

scene.leave((ctx) => {
  console.log("Reg scene leave");
});

scene.hears(Titles.hearsTrigger("BUTTON_CANCEL"), (ctx) => {
  ctx.send("TXT_REG_EXIT_ENSURE", "confirm_keyboard");
});

scene.action("btn_confirm", async (ctx) => {
  await ctx.send("TXT_REG_CANCELED", "user_main_keyboard");
  ctx.scene.leave();
});

scene.action("btn_cancel", async (ctx) => {
  await ctx.deleteMessage();
  return ctx.send(`TXT_REG_STEP_${ctx.wizard.cursor + 1}`);
});

scene.use(async (ctx, next) => {
  console.log("Inside scene Reg");
  console.log(ctx.scene.session);
  if (typeof ctx.callbackQuery !== "undefined") {
    //console.log("Callback data", ctx.callbackQuery);
  }
  await next();
  //await ctx.send("TXT_PROHIBITED_ACTION");
});

export default scene;
