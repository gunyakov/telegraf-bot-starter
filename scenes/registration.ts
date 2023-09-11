import { Scenes, Composer } from "telegraf";
import { ExtContext } from "../src/interface";
import { message } from "telegraf/filters";
import Titles from "../lang/index";
import { Lang } from "../src/enums";
import dbquery from "../DB/index";
import Queries from "../DB/queries";

import validate from "validate.js";
//Init wizard scene with name and define steps
const scene = new Scenes.WizardScene<ExtContext>(
  //Scene name
  "registrationScene",
  //Use composer to apply filters for your steps
  //This is step 1 (cursor is 0)
  Composer.on(message("text"), async (ctx) => {
    //Rules for validation
    let constraints = {
      presence: true,
      type: "string",
      length: {
        minimum: 3,
        maximum: 20,
      },
    };
    //If validator return not null or undefined errors present
    if (validate.single(ctx.message.text, constraints)) {
      return ctx.send(["TXT_REG_STEP_1_ERROR", "TXT_REG_STEP_1"]);
    }
    //If validator return null. errors missing
    else {
      //Get nickname and remove special chars
      ctx.scene.session.nickname = ctx.message.text.replace(
        /[\u0800-\uFFFF]/g,
        ""
      );
      //Send message for step 2
      ctx.send("TXT_REG_STEP_2");
      //Go to next step
      return ctx.wizard.next();
    }
  }),
  //Use composer to apply filters for your steps
  //This is step 2 (cursor is 1)
  Composer.on(message("text"), async (ctx) => {
    //Rules for validation
    let constraints = {
      presence: true,
      email: true,
    };
    //If validator return not null or undefined errors present
    if (validate.single(ctx.message.text, constraints)) {
      return ctx.send(["TXT_REG_STEP_2_ERROR", "TXT_REG_STEP_2"]);
    }
    //If validator return null. errors missing
    else {
      //Get email
      ctx.scene.session.email = ctx.message.text;
      //Insert user info in DB
      let result = await dbquery(Queries.REG_USER, [
        ctx.session.chatID,
        ctx.scene.session.nickname,
        ctx.session.lang || Lang.en,
      ]);
      //If insertring was OK
      if (result) {
        //Show OK message
        ctx.send("TXT_REG_COMPLETED", "user_main_keyboard");
      }
      //Show error message
      else {
        ctx.send("TXT_DB_ERROR", "user_reg_keyboard");
      }
      //Exit from scene
      return ctx.scene.leave();
    }
  })
);
//When scene enter, this call auto
scene.enter((ctx) => {
  //Show message for step 1 and cancel keyboard
  ctx.send("TXT_REG_STEP_1", "cancel_keyboard");
});
//Global hears handler for current scene
scene.hears(Titles.hearsTrigger("BUTTON_CANCEL"), (ctx) => {
  //Show question and confirm inline keyboard
  ctx.send("TXT_REG_EXIT_ENSURE", "confirm_keyboard");
});
//Global action handler for current scene
scene.action("btn:confirm", async (ctx) => {
  //Show message with auto delete of previous message and user registration keyboard
  await ctx.sendWC("TXT_REG_CANCELED", "user_reg_keyboard");
  //Exit from scene
  ctx.scene.leave();
});
//Global action handler for current scene
scene.action("btn:cancel", async (ctx) => {
  //Show message with auto delete of previous message
  return ctx.sendWC(`TXT_REG_STEP_${ctx.wizard.cursor + 1}`);
});
//Export scene
export default scene;
