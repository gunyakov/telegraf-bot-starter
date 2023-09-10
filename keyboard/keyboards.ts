import { Markup } from "telegraf";

import { Keyboards } from "../src/interface";

import Titles from "../lang/index";

let keyboards: Keyboards = {
  user_main_keyboard: (lang, opts) => {
    const buttons = [[Titles.getText("BUTTON_ACCOUNT", lang)]];

    return Markup.keyboard(buttons).resize();
  },

  user_reg_keyboard: (lang, opts) => {
    const buttons = [
      [
        Titles.getText("BUTTON_REGISTRATION", lang),
        Titles.getText("BUTTON_LANGUAGE", lang),
      ],
    ];

    return Markup.keyboard(buttons).resize();
  },

  cancel_keyboard: (lang, opts) => {
    const buttons = [[Titles.getText("BUTTON_CANCEL", lang)]];

    return Markup.keyboard(buttons).resize();
  },
};

export default keyboards;
