import { Context, Markup, Scenes } from "telegraf";
import { Lang } from "./enums";
import {
  InlineKeyboardMarkup,
  ParseMode,
  ReplyKeyboardMarkup,
} from "telegraf/typings/core/types/typegram";

interface ExtWizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp`
  email: string;
  nickname: string;
  password: string;
}

interface ExtSession extends Scenes.WizardSession<ExtWizardSession> {
  userID: number;
  chatID: number;
  name: string;
  lang?: Lang;
}

// Define your own context type
export interface ExtContext extends Context {
  send: (
    key: string,
    keybrd?: string,
    insertions?: Array<string>,
    extra?: SendExtra,
    cleanMessage?: boolean
  ) => Promise<void>;
  getText: (key: string, insertions?: Array<string>, language?: Lang) => string;
  getID: () => number;
  editKeyboard: (keyboard: string, extra?: SendExtra) => Promise<void>;
  editMessage: (
    key: string,
    keyboard?: string,
    insertion?: Array<string>,
    extra?: SendExtra
  ) => Promise<void>;
  setLocale: (languange: Lang) => void;
  session: ExtSession;
  // declare scene type
  scene: Scenes.SceneContextScene<ExtContext, ExtWizardSession>;
  wizard: Scenes.WizardContextWizard<ExtContext>;
}

export interface LangTitles {
  [id: string]: { [key in Lang]: string };
}

export interface SendExtra {
  language?: Lang;
  chatID?: number;
  messageID?: number;
}

export interface BasicOptions {
  parse_mode: ParseMode;
  disable_web_page_preview: boolean;
}

export interface Keyboards {
  [id: string]: (
    ctx: ExtContext,
    opts?: Array<string>
  ) => Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>;
}
