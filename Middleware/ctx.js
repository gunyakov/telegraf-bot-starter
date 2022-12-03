const keyboardConstructor = require('../Keyboards/index.js');

const Titles = require("../Language/index.js");

const basic_options = { parse_mode: 'HTML', disable_web_page_preview: true }

module.exports = ({

	getText: function(key, insertions, language) {

		return Titles.getText(key, insertions, language || this?.session?.lang);
	},
	getID: function() {
			let strData = this.update.callback_query.data;
			let dataID = strData.match(/\d+$/);
			return parseInt(dataID[0]);
	},
  send: async function(key, keyboard, insertions, extra = {}, cleanMessage = true) {

		if(cleanMessage) {
			try {
				this.deleteMessage().catch((e) => {Log.error("BOT", e.response?.description)});
			}
			catch (error) {
			  Log.error("BOT", "Delete message not present in ctx object");
			}
		}
		const text = this.getText(key, insertions, extra.language)
		const chat_id = extra.chat_id || this.chat.id

		if(!keyboard) return this.telegram.sendMessage(chat_id, text, basic_options).catch(async (e) => {Log.error("BOT", e.response?.description)});

		const keyboard_obj = await keyboardConstructor.createKeyboard(keyboard, this, extra.language)

		if(!keyboard_obj) return this.telegram.sendMessage(chat_id, text, basic_options).catch(async (e) => {Log.error("BOT", e.response?.description)});

		const isInline = keyboardConstructor.isInline(keyboard)
		const options = Object.assign(keyboard_obj, basic_options)

		if(isInline && this.session && !extra.chat_id) {

			const response = await this.reply(text, options).catch(async (e) => {Log.error("BOT", e.response?.description)});

			return response
		}

		return this.telegram.sendMessage(chat_id, text, options).catch(async (e) => {Log.error("BOT", e.response?.description)});
	},

	editKeyboard: async function(keyboard, extra = {}) {

		const chat_id = extra.chat_id || this.chat.id
		const message_id = extra.message_id || this.callbackQuery.message.message_id

		const { reply_markup } = await keyboardConstructor.createKeyboard(keyboard, this, extra.language)

		return this.telegram.editMessageReplyMarkup(chat_id, message_id, null, reply_markup)
	},

	editMessage: async function(key, keyboard, insertions, extra = {}) {

	},

  setLocale: async function(language) {

		this.session.language = language;

		query("SET_LANGUAGE", language, this.from.id);
	}

});
