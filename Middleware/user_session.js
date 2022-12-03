module.exports = async (ctx, next) => {
  //reqsec.mark();
  let regUser = false;
  console.time(`Processing update ${ctx.update.update_id}`);
  //If session missing for current chat create default session
  if(!ctx.session) ctx.session = {ID: 0};

  if(!ctx.session.chatID) {
    if(typeof ctx.message !== "undefined") ctx.session.chatID = ctx.message.from.id
    if(typeof ctx.update?.callback_query?.from.id !== "undefined") ctx.session.chatID = ctx.update.callback_query.from.id
  }

  //If request with contact information
  if(ctx.message?.text == "Registration") {
    //Inset user info in DB
    if(await Users.regUser(ctx.message.from.id, ctx.message.from.first_name)) {
      regUser = true;
    }
    else {
      return ctx.send("ERROR_DB_FAIL", "user_reg_keyboard");
    }
  }

  ctx.session = await Users.getUserBychatID(ctx.session.chatID);
  //If user info missing in DB
  if(ctx.session.ID == 0) {
    //Return user request for registration
    return ctx.send("TXT_REGISTRATION", "user_reg_keyboard");
  }
  //If user info present in DB
  else if(ctx.session.reset == "yes" && regUser == false) {
    //currentReqs.inc();
    return ctx.send("TXT_SESSION_RESET", "user_main_keyboard", [], {}, false);
  }
  else if (regUser){
    return ctx.send("TXT_REG_COMPLETED", "user_main_keyboard");
  }
  else {
    //Go to next step
    await next();
  }
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
}
