/**
 * Import description for extendet Context
 * Импорт описания расширеного контекста
 */
import { ExtContext } from "../src/interface";
/**
 * Use as middleware to prevent any actions inside scenes what only for registered users
 * @param ctx - User Extended context
 * @param next - Callback function
 */
export default async function onlyAuthUsers(
  ctx: ExtContext,
  next: CallableFunction
) {
  if (ctx.session.userID) {
    await next();
  } else {
    ctx.send("TXT_ONLY_FOR_AUTH_USERS", "user_reg_keyboard");
  }
  return;
}
