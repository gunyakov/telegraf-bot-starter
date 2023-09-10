import dbquery from "../DB/index";
import Queries from "../DB/queries";
import { Lang } from "../src/enums";
import { ExtContext } from "../src/interface";

export default async (ctx: ExtContext, next: CallableFunction) => {
  console.time(`Processing update ${ctx.update.update_id}`);

  if (!ctx.session.chatID) {
    if (typeof ctx.message !== "undefined") {
      ctx.session.chatID = ctx.message.from.id;
      ctx.session.tgName = ctx.message.from.first_name;
    }
    if (typeof ctx.callbackQuery !== "undefined") {
      ctx.answerCbQuery();
      ctx.session.chatID = ctx.callbackQuery.from.id;
      ctx.session.tgName = ctx.callbackQuery.from.first_name;
    }
  }
  let userInfo = (await dbquery(
    Queries.GET_ONE_USER,
    [ctx.session.chatID],
    true
  )) as { ID: number; lang: Lang; name: string };
  if (userInfo) {
    ctx.session.userID = userInfo.ID;
    ctx.session.lang = userInfo.lang;
    ctx.session.name = userInfo.name;
  }
  //Go to next step
  await next();
  //console.log("Session after actions", ctx.session);
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
};
