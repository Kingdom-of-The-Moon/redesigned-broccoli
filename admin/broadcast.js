const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	wss.clients.forEach(client => {
		if (client.ready) {
			utils.send(client, msg.data);
		}
	});
};