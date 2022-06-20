const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (ws.ready) return;

	if (!msg.token || !config.adminKeys.includes(msg.token)) return ws.close(4000);

	ws.ready = true;

	utils.send(ws, { type: 'connected' });
};