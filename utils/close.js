module.exports = (wss, ws, events, mongo, redis, clients, logger) => {
	for (let sub of Object.keys(ws.subscribedTo)) {
		events.off(sub, () => { });
	}
	delete clients.byUuid[ws.uuid];
	logger.log('info', `${ws.ip} ${ws.uuid} disconnected`);
}