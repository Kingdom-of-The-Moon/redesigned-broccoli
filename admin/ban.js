const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	if (!msg.uuid) return;
	await mongo.collection('users').updateOne({ uuid: msg.uuid }, {
		$set: {
			banned: msg.reason ? msg.reason : true
		}
	});
};