const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients) => {
	if (!ws.ready) return;

	wss.clients.forEach(client => {
		client.close(1012, 'Restarting');
	});

	process.exit(0);
};