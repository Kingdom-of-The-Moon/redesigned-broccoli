const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return ws.close();

	if (ws.subscribedTo[msg.uuid]) return;

	ws.subscribedTo[msg.uuid] = events.on(msg.uuid, data => {
		utils.send(ws, { type: 'event', uuid: msg.uuid, event: data });
	});
}