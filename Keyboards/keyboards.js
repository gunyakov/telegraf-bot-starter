const { Markup } = require('telegraf')

exports.user_main_keyboard = (ctx) => {

	const buttons = [
		[
			ctx.getText('BUTTON_ACCOUNT')
		]
	]

	return Markup.keyboard(buttons).resize();
}

exports.user_reg_keyboard = (ctx) => {

	const buttons = [
		[
			//{text: ctx.getText("BUTTON_REGISTRATION"), request_contact: true}
			ctx.getText("BUTTON_REGISTRATION")
		]
	]

	return Markup.keyboard(buttons).resize();
}

exports.cancel_keyboard = (ctx) => {
	const buttons = [
		[
			ctx.getText('BUTTON_CANCEL'),
		]
	]

	//if(ctx.session.state == "crewing") buttons.push([ ctx.getText('BUTTON_CREWING') ])

	return Markup.keyboard(buttons).resize();
}
