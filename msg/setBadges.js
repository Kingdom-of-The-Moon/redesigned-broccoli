const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (ws.ready) return;

	if (!msg.badges) return;
	if (!msg.badges.isArray()) return;
	if (msg.badges.length !== config.limits[ws.rank].allowedBadges.length) return;

	let badges = msg.badges.map(b => b.isNumber() ? b : 0);
	
	badges.map((b, i) => {
		if (!ws.limits.allowedBadges[i]) return 0;
		else return b;
	});

	await mongo.collection('users').updateOne({ uuid: uuid }, {
		$set: {
			equippedBadges: badges
		}
	});

	events.emit(ws.uuid, { type: 'badges', badges });
};