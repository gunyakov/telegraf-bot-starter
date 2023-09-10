import { LogType } from "./enums";
//------------------------------------------------------------------------------
//Color console
//------------------------------------------------------------------------------
let colors = require("colors");

import { LOG } from "../config";
//------------------------------------------------------------------------------
//Handle logs
//------------------------------------------------------------------------------
let arrLog = {
  info: [],
  error: [],
  warning: [],
  success: [],
};

class Log {
  constructor() {}

  async make(type: LogType, module: string, message: string) {
    if (
      type != LogType.info &&
      type != LogType.error &&
      type != LogType.warning &&
      type != LogType.success
    ) {
      type = LogType.info;
    }
    //If entries counter more than set in config
    if (arrLog[type].length > LOG.LENGTH) {
      //Delete first entry from log
      arrLog[type].shift();
    }
    //Add new entry to the end of log
    //@ts-ignore
    arrLog[type].push(message);

    let format_module = module;
    if (module.length < 7) {
      for (let i = module.length; i < 7; i++) {
        format_module += " ";
      }
    }
    format_module.toUpperCase();
    //@ts-ignore
    if (!LOG[module]) {
      console.log(
        colors.red(new Date().toLocaleString("en-GB")),
        colors.red.bold(format_module),
        colors.red.bold("ERROR    "),
        colors.red("Cant find config for this log module.")
      );
    } else {
      //If enable display such type of mesage in block
      //@ts-ignore
      if (LOG[module][type]) {
        //Show success message
        if (type == LogType.success) {
          console.log(
            colors.green(new Date().toLocaleString("en-GB")),
            colors.green.bold(format_module),
            colors.green.bold("SUCCESS  "),
            colors.green(message)
          );
        }
        //Show error message
        if (type == LogType.error) {
          console.log(
            colors.red(new Date().toLocaleString("en-GB")),
            colors.red.bold(format_module),
            colors.red.bold("ERROR    "),
            colors.red(message)
          );
        }
        //Show error message
        if (type == LogType.warning) {
          console.log(
            colors.yellow(new Date().toLocaleString("en-GB")),
            colors.yellow.bold(format_module),
            colors.yellow.bold("WARNING  "),
            colors.yellow(message)
          );
        }
        //Show info message
        if (type == LogType.info) {
          console.log(
            colors.blue(new Date().toLocaleString("en-GB")),
            colors.blue.bold(format_module),
            colors.blue.bold("INFO     "),
            colors.blue(message)
          );
        }
      }
    }
  }

  async error(module: string, message: string) {
    this.make(LogType.error, module, message);
  }

  async warning(module: string, message: string) {
    this.make(LogType.warning, module, message);
  }

  async success(module: string, message: string) {
    this.make(LogType.success, module, message);
  }

  async info(module: string, message: string) {
    this.make(LogType.info, module, message);
  }
}
export default new Log();
