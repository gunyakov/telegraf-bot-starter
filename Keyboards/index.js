const inlineKeyboards = require('./inlineKeyboards')
const usualKeyboards = require('./keyboards')


class KeyboardConstructor {

	constructor() {

		this.keyboards = { ...inlineKeyboards, ...usualKeyboards }
	}

	createKeyboard(keyboard, context, language) {

		if(typeof keyboard === 'string') return this.keyboards[keyboard](context)

		if(!Array.isArray(keyboard) || !this.keyboards[keyboard[0]]) throw 'Cannot create keyboard'

		const keyboard_name = keyboard[0]
		const keyboard_args = keyboard.slice(1)

		return this.keyboards[keyboard_name](context, ...keyboard_args)
	}

	isInline(keyboard) {

		const keyboard_name = typeof keyboard === 'string' ? keyboard : keyboard?.[0]

		return inlineKeyboards.hasOwnProperty(keyboard_name)
	}
}


module.exports = new KeyboardConstructor()
