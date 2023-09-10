import {ExtContext, Keyboards } from '../src/interface';
import inlineKeyboards from './inlineKeyboards';
import usualKeyboards from './keyboards';


class KeyboardConstructor {

	private keyboards:Keyboards = {};

	constructor() {

		this.keyboards = { ...inlineKeyboards, ...usualKeyboards }
	}

	async createKeyboard(keyboard:string | Array<string>, context:ExtContext) {

		if(typeof keyboard === 'string') return this.keyboards[keyboard](context)

		if(!Array.isArray(keyboard) || !this.keyboards[keyboard[0]]) throw 'Cannot create keyboard'

		const keyboard_name = keyboard[0]
		const keyboard_args = keyboard.slice(1)

		return this.keyboards[keyboard_name](context, keyboard_args);
	}

	isInline(keyboard:string) {

		const keyboard_name = typeof keyboard === 'string' ? keyboard : keyboard?.[0]

		return inlineKeyboards.hasOwnProperty(keyboard_name)
	}
}

export default new KeyboardConstructor();
