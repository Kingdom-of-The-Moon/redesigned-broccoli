module.exports = (wss, ws, events, mongo, redis) => {
	for (let sub of Object.keys(ws.subscribedTo)) {
		events.off(sub, () => { });
	}
	console.log(`${ws.uuid} disconnected.`);
}