const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;
	if (!msg.uuid) return;

	if (ws.subscribedTo[msg.uuid]) events.off(ws.subscribedTo[msg.uuid]);
}