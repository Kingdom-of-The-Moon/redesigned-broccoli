const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'error', bottom: 'invalid_uuid' });

	const avatars = await mongo.collection('avatars').find({ owner: msg.uuid }).toArray(); // this was written by github copilot, idk if it works
	// the comment above this line was written by github copilot
	// the comment above this line was not written by github copilot, I wrote it using my nose.

	utils.send(ws, { type: 'avatars', avatars });
}