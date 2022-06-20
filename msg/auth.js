const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (ws.ready) return;

	if (!msg.token) return ws.close(4000);

	const uuid = await redis.get(msg.token);

	if (!uuid) return ws.close(4000);

	ws.uuid = uuid;

	let user = await mongo.collection('users').findOne({ uuid: uuid });

	if (user) {
		await mongo.collection('users').updateOne({ uuid: uuid }, {
			$set: {
				lastUsed: new Date()
			}
		});
	}

	if (!user) { // PLEASE make this not stupid.
		user = {
			uuid: uuid,
			rank: 'default',
			equipped: [],
			lastUsed: new Date()
		}
		await mongo.collection('users').insertOne(user);
	}

	ws.rank = user.rank;

	ws.limits = config.limits[ws.rank];

	ws.ready = true;

	limits = {};

	Object.keys(ws.limits).map(k => {
		let limit = ws.limits[k];
		if (limit?.constructor.name == 'RateLimiterMemory') limits[k] = limit._points / limit._duration;
		else limits[k] = limit;
	});

	utils.send(ws, { type: 'connected', limits });

	console.log(`${ws.uuid} connected.`);
};