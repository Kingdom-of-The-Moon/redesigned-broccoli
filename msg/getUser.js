const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'error', bottom: 'invalid_uuid' });

	const user = await mongo.collection('users').findOne({ uuid: msg.uuid });

	user.allowedBadges = ws.limits.allowedBadges;

	utils.send(ws, { type: 'userInfo', user });
}