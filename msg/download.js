const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.owner || !msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid avatar download query.' });

	ws.limits.download.consume(1).catch(() => { return });

	const avatar = await mongo.collection('avatars').findOne({ owner: msg.owner, uuid: msg.uuid });

	utils.send(ws, { type: 'avatar', avatar: avatar });
}