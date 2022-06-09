const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'Delete Error', bottom: 'Invalid query.' });

	const a = await mongo.collection('avatars').deleteOne({ owner: ws.uuid, uuid: msg.uuid });

	if (a.deletedCount == 0) return utils.send(ws, { type: 'toast', toast: 'error', top: 'Delete Error', bottom: 'Avatar not found.' }); // gh copilot, idk if it works

	utils.send(ws, { type: 'toast', toast: 'default', top: 'Notice', bottom: 'Avatar deleted.' });
}