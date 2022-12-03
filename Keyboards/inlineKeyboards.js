const { Markup } = require('telegraf')
const callbackButton = Markup.button.callback
const { inlineKeyboard } = Markup

const query = require("../DB/index.js");

exports.account_keyboard = (ctx) => {
	const keyboard = inlineKeyboard([
		[ callbackButton(ctx.getText('BUTTON_LANGUAGE'), 'change_language') ],
		[ callbackButton(ctx.getText('BUTTON_DELETE_ME'), 'delete_me') ]

	 ], { columns: 1 });

	return keyboard
}

exports.account_language = (ctx) => inlineKeyboard([

	callbackButton('🇷🇺', 'language_ru'),
	callbackButton('🇺🇸', 'language_en')

], { columns: 1 })

exports.confirm_keyboard = (ctx) => inlineKeyboard([

	[callbackButton(ctx.getText('BUTTON_YES'), 'delete_me_confirm'),
	callbackButton(ctx.getText('BUTTON_CANCEL'), 'delete_me_cancel')]

], { columns: 1 })
