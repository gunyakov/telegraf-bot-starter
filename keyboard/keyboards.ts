import { Markup } from 'telegraf';

import {Keyboards } from '../src/interface';

let keyboards:Keyboards = {
	
	user_main_keyboard: (ctx, opts) => {

		const buttons = [
			[
				ctx.getText('BUTTON_ACCOUNT')
			]
		]

		return Markup.keyboard(buttons).resize();
	},
	
	user_reg_keyboard: (ctx, opts) => {

		const buttons = [
			[
				//{text: ctx.getText("BUTTON_REGISTRATION"), request_contact: true}
				ctx.getText("BUTTON_REGISTRATION")
			]
		]
	
		return Markup.keyboard(buttons).resize();
	},

	cancel_keyboard: (ctx, opts) => {
		const buttons = [
			[
				ctx.getText('BUTTON_CANCEL'),
			]
		]
	
		//if(ctx.session.state == "crewing") buttons.push([ ctx.getText('BUTTON_CREWING') ])
	
		return Markup.keyboard(buttons).resize();
	}
}

export default keyboards;