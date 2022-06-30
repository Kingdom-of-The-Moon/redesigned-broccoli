const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.id) return utils.send(ws, { type: 'toast', toast: 'error', top: 'delete_error', bottom: 'delete_invalid' });

	const a = await mongo.collection('avatars').deleteOne({ owner: ws.uuid, id: msg.id });

	if (a.deletedCount == 0) return utils.send(ws, { type: 'toast', toast: 'error', top: 'delete_error', bottom: 'delete_not_found' }); // gh copilot, idk if it works

	utils.send(ws, { type: 'toast', toast: 'default', top: 'delete_success' });

	events.emit(ws.uuid, { type: 'delete', uuid: ws.uuid });

	logger.log('info', `${ws.ip} ${ws.uuid} deleted avatar ${msg.id}`);
}