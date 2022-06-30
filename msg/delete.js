const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.id) return events.emit(ws.uuid, { type: 'delete_error', reason: 'delete_invalid', self: true});

	const a = await mongo.collection('avatars').deleteOne({ owner: ws.uuid, id: msg.id });

	if (a.deletedCount == 0) return events.emit(ws.uuid, { type: 'delete_error', reason: 'delete_not_found', self: true}); // gh copilot, idk if it works

	// utils.send(ws, { type: 'toast', toast: 'default', top: 'delete_success' });

	events.emit(ws.uuid, { type: 'delete', id: msg.id });

	logger.log('info', `${ws.ip} ${ws.uuid} deleted avatar ${msg.id}`);
}