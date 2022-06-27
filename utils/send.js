module.exports = function (ws, data) {
	ws.send(JSON.stringify(data));
};