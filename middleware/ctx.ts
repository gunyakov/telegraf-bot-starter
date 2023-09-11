import keyboardConstructor from "../keyboard/index";
import { Lang } from "../src/enums";
import Titles from "../lang/index";
import { BasicOptions, ExtContext, SendExtra } from "../src/interface";
import { callbackQuery } from "telegraf/filters";
import Log from "../src/log";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Markup } from "telegraf";

const basic_options: BasicOptions = {
  parse_mode: "HTML",
  disable_web_page_preview: true,
};

export default async function (ctx: ExtContext, next: CallableFunction) {
  ctx.getText = function (key, insertions): string {
    return Titles.getText(key, ctx.session.lang || Lang.en, insertions);
  };

  ctx.getID = function (): number {
    if (ctx.has(callbackQuery("data"))) {
      let strData = ctx.callbackQuery.data;
      if (strData) {
        let dataID = strData.match(/\d:$/);
        return parseInt(dataID ? dataID[0] : "0");
      }
    }
    return 0;
  };

  ctx.getParameter = function (): string {
    if (ctx.has(callbackQuery("data"))) {
      let strData = ctx.callbackQuery.data;
      if (strData) {
        let dataID = strData.split(":");
        return dataID ? dataID[1] : "";
      }
    }
    return "";
  };

  ctx.send = async function (
    key,
    keyboard,
    insertions,
    extra,
    cleanMessage
  ): Promise<void> {
    let lang = extra?.language || ctx.session?.lang || Lang.en;

    if (cleanMessage) {
      try {
        ctx.deleteMessage().catch((e) => {
          Log.error("BOT", e.response?.description);
        });
      } catch (error) {
        Log.error("BOT", "Delete message not present in ctx object");
      }
    }

    const text = ctx.getText(key, insertions, lang);
    const chat_id = extra?.chatID || ctx.session?.chatID || 0;

    if (!keyboard) {
      ctx.telegram
        .sendMessage(chat_id, text, basic_options)
        .catch(async (e) => {
          Log.error("BOT", e.response?.description);
        });
      return;
    }

    const keyboard_obj = await keyboardConstructor.createKeyboard(
      keyboard,
      ctx.session.lang || Lang.en
    );

    if (!keyboard_obj) {
      ctx.telegram
        .sendMessage(chat_id, text, basic_options)
        .catch(async (e) => {
          Log.error("BOT", e.response?.description);
        });
      return;
    }

    const isInline = keyboardConstructor.isInline(keyboard);
    const options = Object.assign(keyboard_obj, basic_options);

    if (isInline && ctx.session?.userID && !extra?.chatID) {
      await ctx.reply(text, options).catch(async (e) => {
        Log.error("BOT", e.response?.description);
      });

      return;
    }

    ctx.telegram.sendMessage(chat_id, text, options).catch(async (e) => {
      Log.error("BOT", e.response?.description);
    });
  };

  ctx.sendWC = async function (
    key: string,
    keyboard?: string,
    insertions?: Array<string>,
    extra?: SendExtra
  ): Promise<void> {
    await ctx.deleteMessage();
    await ctx.send(key, keyboard, insertions, extra, true);
  };

  ctx.editKeyboard = async function (
    keyboard: string,
    extra?: SendExtra
  ): Promise<void> {
    const chat_id = extra?.chatID || ctx.session?.chatID;
    const message_id =
      extra?.messageID || ctx.callbackQuery?.message?.message_id;

    const { reply_markup } = (await keyboardConstructor.createKeyboard(
      keyboard,
      ctx.session.lang || Lang.en
    )) as Markup.Markup<InlineKeyboardMarkup>;

    ctx.telegram.editMessageReplyMarkup(
      chat_id,
      message_id,
      undefined,
      reply_markup
    );
  };

  ctx.editMessage = async function (
    key: string,
    keyboard?: string,
    insertion?: Array<string>,
    extra?: SendExtra
  ): Promise<void> {
    let lang = extra?.language || ctx.session?.lang || Lang.en;

    const text = ctx.getText(key, insertion, lang);

    const chat_id = extra?.chatID || ctx.session?.chatID;
    const message_id =
      extra?.messageID || ctx.callbackQuery?.message?.message_id;

    let markup;

    if (keyboard)
      markup = (await keyboardConstructor.createKeyboard(
        keyboard,
        ctx.session.lang || Lang.en
      )) as Markup.Markup<InlineKeyboardMarkup>;

    ctx.telegram.editMessageReplyMarkup(
      chat_id,
      message_id,
      text,
      markup?.reply_markup
    );
  };

  ctx.setLocale = function (language: Lang): void {
    if (ctx.session) ctx.session.lang = language;
  };

  await next();
}
