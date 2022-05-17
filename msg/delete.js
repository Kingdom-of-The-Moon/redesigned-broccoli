const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid delete query.' });

	const a = await mongo.collection('avatars').deleteOne({ owner: ws.uuid, uuid: msg.uuid });

	if (a.deletedCount == 0) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Avatar not found.' }); // gh copilot, idk if it works

	utils.send(ws, { type: 'toast', toast: 'default', msg: 'Avatar deleted.' });
}