const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'error', bottom: 'invalid_uuid' });

	const user = await mongo.collection('users').findOne({ uuid: msg.uuid });

	user.limits = ws.limits;

	Object.keys(user.limits).map(k => {
		let limit = user.limits[k];
		if (limit?.constructor.name == 'RateLimiterMemory') user.limits[k] = [limit._points, limit._duration];
	});

	utils.send(ws, { type: 'userInfo', user });
}