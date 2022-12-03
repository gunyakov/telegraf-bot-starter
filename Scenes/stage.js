const { Telegraf, Scenes: { Stage }, Composer} = require('telegraf')
const Title = require("../Language/index.js");

//Connect scennes here. Possible create few stages with scenes.
const userAccount = new Stage([
	require('./account'),
])

userAccount.hears(Title.hearsTrigger('BUTTON_ACCOUNT'), ctx => ctx.scene.enter('accountScene'))

const stages = new Composer();

stages.use(userAccount);
/*Can be
staege.use(scene1, scene2, ...sceneN);
*/
module.exports = Telegraf.chatType('private', stages);
