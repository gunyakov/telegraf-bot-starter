import { ExtContext } from "../src/interface";

export default async function onlyAuthUsers(
  ctx: ExtContext,
  next: CallableFunction
) {
  if (ctx.session.userID) {
    await next();
  } else {
    ctx.send("TXT_ONLY_FOR_AUTH_USERS", "user_reg_keyboard");
  }
}
