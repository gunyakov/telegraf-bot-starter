import { Markup } from "telegraf";

const callbackButton = Markup.button.callback;

import { Keyboards } from "../src/interface";

import Titles from "../lang/index";

import dbquery from "../DB/index";

let keyboards: Keyboards = {
  account_keyboard: (lang) => {
    const keyboard = Markup.inlineKeyboard([], { columns: 1 });
    keyboard.reply_markup.inline_keyboard.push([
      callbackButton(
        Titles.getText("BUTTON_LANGUAGE", lang),
        "change_language",
        true
      ),
    ]);
    keyboard.reply_markup.inline_keyboard.push([
      callbackButton(Titles.getText("BUTTON_DELETE_ME", lang), "delete_me"),
    ]);
    return keyboard;
  },

  account_language: (lang) =>
    Markup.inlineKeyboard(
      [
        callbackButton("🇷🇺", "language:ru"),
        callbackButton("🇺🇸", "language:en"),
      ],
      { columns: 2 }
    ),

  confirm_keyboard: (lang) => {
    const keyboard = Markup.inlineKeyboard([], { columns: 1 });

    keyboard.reply_markup.inline_keyboard.push([
      callbackButton(Titles.getText("BUTTON_YES", lang), "btn:confirm"),
    ]);
    keyboard.reply_markup.inline_keyboard.push([
      callbackButton(Titles.getText("BUTTON_CANCEL", lang), "btn:cancel"),
    ]);
    return keyboard;
  },
};

export default keyboards;
