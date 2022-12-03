//------------------------------------------------------------------------------
//Color console
//------------------------------------------------------------------------------
let colors = require('colors');

const { LOG } = require("../config.js");
//------------------------------------------------------------------------------
//Handle logs
//------------------------------------------------------------------------------
class Log {
  constructor() {
    this.arrLog = {
      'info': [],
      'error': [],
      'warning': [],
      'success': []
    }
  }

  async make(type, module,  message) {
    if(type != "info" && type != "error" && type != "warning" && type != "success") {
      type = "info";
    }
    //If entries counter more than set in config
    if(this.arrLog[type].length > LOG.LENGTH) {
      //Delete first entry from log
      this.arrLog[type].shift();
    }
    //Add new entry to the end of log
    this.arrLog[type].push(message);
    //If eneble display such type of mesage in block
    if(LOG[module][type]) {
      //Show success message
      if(type == "success") {
        console.log(colors.green(new Date().toLocaleString("en-GB")), colors.green.bold(type.toUpperCase()), colors.green.bold(module.toUpperCase()), colors.green(message));
      }
      //Show error message
      if(type == "error") {
        console.log(colors.red(new Date().toLocaleString("en-GB")), colors.red.bold(type.toUpperCase()), colors.red.bold(module.toUpperCase()), colors.red(message));
      }
      //Show error message
      if(type == "warning") {
        console.log(colors.yellow(new Date().toLocaleString("en-GB")), colors.yellow.bold(type.toUpperCase()), colors.yellow.bold(module.toUpperCase()), colors.yellow(message));
      }
      //Show info message
      if(type == "info") {
        console.log(colors.blue(new Date().toLocaleString("en-GB")), colors.blue.bold(type.toUpperCase()), colors.blue.bold(module.toUpperCase()), colors.blue(message));
      }
    }
  }

  async error(module, message) {
    this.make('error', module, message);
  }

  async warning(module, message) {
    this.make("warning", module, message);
  }

  async success(module, message) {
    this.make("success", module, message);
  }

  async info(module, message) {
    this.make("info", module, message);
  }

}
module.exports = new Log();
