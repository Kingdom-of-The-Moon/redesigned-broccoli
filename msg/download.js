const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid || !msg.name) return utils.send(ws, { type: 'error', error: 'Invalid avatar download query.' });

	ws.limits.download.consume(1).catch(() => { return });

	const avatar = await mongo.collection('avatars').findOne({ uuid: msg.uuid, name: msg.name });

	utils.send(ws, { type: 'avatar', avatar: { uuid: msg.uuid, name: msg.name, data: avatar } });
}