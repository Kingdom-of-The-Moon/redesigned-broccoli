const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.uuid) return ws.close();

	if (ws.subscribedTo[msg.uuid]) return;

	ws.subscribedTo[msg.uuid] = events.on(msg.uuid, data => {
		utils.send(ws, { type: 'ping', uuid: msg.uuid, data: pingData });
	});
}