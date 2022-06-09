module.exports = function (ws, data) {
	console.log('send', ws.uuid, data);
	ws.send(JSON.stringify(data));
};