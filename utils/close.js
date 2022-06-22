module.exports = (wss, ws, events, mongo, redis, clients) => {
	for (let sub of Object.keys(ws.subscribedTo)) {
		events.off(sub, () => { });
	}
	delete clients.byUuid[ws.uuid];
	console.log(`${ws.uuid} disconnected.`);
}