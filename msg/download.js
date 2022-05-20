const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.owner || !msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid avatar download params.' });

	ws.limits.download.consume(1).catch(() => { return utils.rateLimited(ws) });

	const avatar = await mongo.collection('avatars').findOne({ owner: msg.owner, uuid: msg.uuid });

	if (!avatar) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Avatar not found.' });

	utils.send(ws, { type: 'avatar', avatar: avatar });
}