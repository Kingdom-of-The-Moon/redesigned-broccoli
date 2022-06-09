const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'hi fran', bottom: 'you did an oops' });

	const user = await mongo.collection('users').findOne({ uuid: msg.uuid });

	utils.send(ws, { type: 'userInfo', user });
}