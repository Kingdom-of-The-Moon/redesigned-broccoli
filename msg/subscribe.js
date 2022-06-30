const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.uuid) return ws.close();

	if (ws.subscribedTo[msg.uuid]) return;

	ws.subscribedTo[msg.uuid] = events.on(msg.uuid, data => {
		if (data.self && ws.uuid !== msg.uuid) return;
		if (data.type == 'ping' && !data.sync) return;
		utils.send(ws, { type: 'event', uuid: msg.uuid, event: data });
	});
}