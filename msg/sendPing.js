const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.data) return ws.close();

	ws.limits.pingSize.consume(ws.ip, msg.data.length).then(async () => {
		ws.limits.pingRate.consume(ws.ip, 1).then(async () => {
			events.emit(ws.uuid, { type: 'ping', data: msg.data });
		}).catch(() => { return utils.rateLimited(ws, 'ping rate') });
	}).catch(() => { return utils.rateLimited(ws, 'ping size') });
}