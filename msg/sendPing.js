const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.data.isArray() || !msg.name) return ws.close();

	ws.limits.pingSize.consume(ws.ip, new Blob([JSON.stringify(msg.data)]).size /* might cause memory leaks, will fix if it happens */).then(async () => {
		ws.limits.pingRate.consume(ws.ip, 1).then(async () => {
			events.emit(ws.uuid, { type: 'ping', data: msg.data, name: msg.name });
		}).catch(() => { return utils.rateLimited(ws, 'ping_rate') });
	}).catch(() => { return utils.rateLimited(ws, 'ping_size') });
}