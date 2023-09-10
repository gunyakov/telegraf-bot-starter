import dbquery from "../DB/index";
import Queries from "../DB/queries";
import { ExtContext } from "../src/interface";

export default async (ctx: ExtContext, next: CallableFunction) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  //If session missing for current chat create default session;
  if (!ctx.session) {
    console.log("Session is missing");
    ctx.session = {
      userID: 0,
      chatID: 0,
      name: "",
    };
  }

  if (!ctx.session.chatID) {
    if (typeof ctx.message !== "undefined") {
      ctx.session.chatID = ctx.message.from.id;
      ctx.session.name = ctx.message.from.first_name;
    }
    if (typeof ctx.callbackQuery !== "undefined") {
      ctx.answerCbQuery();
      ctx.session.chatID = ctx.callbackQuery.from.id;
      ctx.session.name = ctx.callbackQuery.from.first_name;
    }
  }
  let userInfo = (await dbquery(
    Queries.GET_ONE_USER,
    [ctx.session.chatID],
    true
  )) as { ID: number };
  if (userInfo) {
    ctx.session.userID = userInfo.ID;
  }
  //Go to next step
  await next();
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
};
