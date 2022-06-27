const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	wss.clients.forEach(client => {
		if (client.ready) {
			utils.send(client, {
				type: 'toast',
				toast: msg.toast ? msg.toast : 'default',
				top: msg.top ? msg.top : '',
				bottom: msg.bottom ? msg.bottom : '',
				raw: true
			});
		}
	});
};