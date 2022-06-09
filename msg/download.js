const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	ws.limits.download.consume(ws.ip, 1).then(async () => {
		if (!msg.owner || !msg.id) return utils.send(ws, { type: 'toast', toast: 'error', top: 'error', bottom: 'invalid_data' });

		const avatar = await mongo.collection('avatars').findOne({ owner: msg.owner, id: msg.id });

		if (!avatar) return;

		utils.send(ws, { type: 'avatar', avatar: avatar });
	}).catch(() => { return utils.rateLimited(ws, 'download') });
}