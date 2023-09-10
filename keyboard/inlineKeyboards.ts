import { Markup} from "telegraf";

const callbackButton = Markup.button.callback;

import { Keyboards } from "../src/interface";

import dbquery from "../DB/index";

let keyboards:Keyboards = {
	account_keyboard: (ctx) => {
	// const keyboard = inlineKeyboard([

	// 	[ callbackButton(ctx.getText('BUTTON_LANGUAGE') as string, 'change_language', true) ],
	// 	[ callbackButton(ctx.getText('BUTTON_DELETE_ME'), 'delete_me') ]

	//  ], { columns: 1 });
		const keyboard = Markup.inlineKeyboard([], { columns: 1 });
		keyboard.reply_markup.inline_keyboard.push([ callbackButton(ctx.getText('BUTTON_LANGUAGE'), 'change_language', true) ]);
		keyboard.reply_markup.inline_keyboard.push([ callbackButton(ctx.getText('BUTTON_DELETE_ME'), 'delete_me') ]);
		return keyboard;

	},

	account_language: (ctx) => Markup.inlineKeyboard([

		callbackButton('🇷🇺', 'language_ru'),
		callbackButton('🇺🇸', 'language_en')
	
	], { columns: 2 }),

	confirm_keyboard: (ctx) => {

		const keyboard = Markup.inlineKeyboard([], { columns: 1 });
		
		keyboard.reply_markup.inline_keyboard.push([callbackButton(ctx.getText('BUTTON_YES'), 'btn_confirm')]);
		keyboard.reply_markup.inline_keyboard.push([callbackButton(ctx.getText('BUTTON_CANCEL'), 'btn_cancel')])
		return keyboard;
	}
}

export default keyboards;

