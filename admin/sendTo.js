const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	const client = clients.byUuid[msg.uuid];

	if (!client) return;
	utils.send(client, {
		type: 'toast',
		toast: msg.toast ? msg.toast : 'default',
		top: msg.top ? msg.top : '',
		bottom: msg.bottom ? msg.bottom : '',
		raw: true
	});
};