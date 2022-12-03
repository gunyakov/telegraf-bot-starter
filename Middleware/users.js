//------------------------------------------------------------------------------
//DB handler
//------------------------------------------------------------------------------
const query = require("../DB/index.js");

class Users {

  constructor(){
    this.usersList = {};
  }
  //----------------------------------------------------------------------------
  //GET USER INFO FROM DB BY CHAT ID
  //----------------------------------------------------------------------------
  async getUserBychatID(chatID) {
    //IF user info missing in users list
    if(typeof this.usersList[chatID] == "undefined") {
      //Create default user info
      this.usersList[chatID] = {
        ID: 0,
        premium: 0,
        lang: 'en',
        name: 'noname'
      }
    }
    if(this.usersList[chatID]['ID'] == 0) {
      //Ask for user info from DB
      let rows = await query("GET_ONE_USER", [chatID]);
      Log.info("SESSION", `Ask user info ${chatID}`);
      //If user info missing in DB return default user info
      if(rows) {
        this.usersList[chatID] = rows;
        this.usersList[chatID]['reset'] = "yes";
      }
    }
    //If user info present in user list
    else {
      //Return user info
      this.usersList[chatID]['reset'] = "no";
    }
    this.usersList[chatID]['last_action'] = Math.floor(Date.now() / 1000);
    //Return user info
    return this.usersList[chatID];
  }

  async getUserByID(userID) {
    for(let i = 0; i < this.usersList.length; i++) {
      if(this.usersList[i]['ID'] == userID) {
        return this.usersList[i];
      }
    }
    let result = await query("GET_ONE_USER_BY_ID", [userID]);
    return result;
  }

  async regUser(chatID, userName) {
    let user = await this.getUserBychatID(chatID);
    if(user.ID == 0) {
      try {
        userName = userName.replace(/[\u0800-\uFFFF]/g, '');
      } catch(e) {
        Log.warning("SESSION", `Error to replace UTF-16 in user name ${userName}`);
      }
      return await query("REG_USER", [chatID, userName]);
    }
    return true;
  }

  async setLanguage(chatID, lang = "ru") {
    let user = await this.getUserBychatID(chatID);
    if(user.lang !== lang) {
      await query("USER_SET_LANGUAGE", [lang, chatID]);
      this.usersList[chatID]['lang'] = lang;
      return true;
    }
    else {
      return false;
    }
  }

  async getUsersOnline() {
    let count = 0;
    for (let [key, value] of Object.entries(this.usersList)) {
  		if(value.last_action + 300 > Math.floor(Date.now() / 1000)) {
        count++;
      }
  	}
    return count;
  }

  async deleteMe(chatID) {

    let error = false;

    if(!await query("DELETE_USER", [chatID])) {
      error = true;
    }
    //Can be many request to different tables. Error var monitor that all request is OK.

    this.usersList[chatID] = {ID: 0};

    return !error;
  }

}

module.exports = new Users();
