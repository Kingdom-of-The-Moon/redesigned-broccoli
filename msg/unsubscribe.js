module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;
	if (!msg.uuid) return;

	if (ws.subscribedTo[msg.uuid]) events.off(ws.subscribedTo[msg.uuid]);
}