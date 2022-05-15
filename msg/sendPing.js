const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.data) return ws.close();

	ws.limits.pingSize.consume(msg.data.length).catch(() => { return });
	ws.limits.pingRate.consume(1).catch(() => { return });

	events.emit(`${ws.uuid}:ping`, msg.data);
}