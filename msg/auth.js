const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (ws.ready) return;

	if (!msg.token) return ws.close(4000);

	const uuid = await redis.get(msg.token);

	if (!uuid) return ws.close(4000);

	ws.uuid = uuid;

	let user = await mongo.collection('users').findOne({ uuid: uuid });

	if (user) {
		await mongo.collection('users').updateOne({ uuid: uuid }, {
			$set: {
				lastUsed: new Date(),
				lastIP: ws.ip
			}
		});
	}

	if (!user) { // PLEASE make this not stupid.
		user = {
			uuid: uuid,
			rank: 'default',
			equipped: [],
			lastUsed: new Date(),
			lastIP: ws.ip
		}
		await mongo.collection('users').insertOne(user);
	}

	if (user.banned) return ws.close(4001, typeof user.banned === 'string' ? user.banned : 'no ban reason');

	ws.rank = user.rank;

	ws.limits = config.limits[ws.rank];

	ws.ready = true;

	ws.subscribedTo[ws.uuid] = events.on(ws.uuid, data => {
		utils.send(ws, { type: 'event', uuid: ws.uuid, event: data });
	});

	clients.byUuid[uuid] = ws;

	limits = {};

	Object.keys(ws.limits).map(k => {
		let limit = ws.limits[k];
		if (limit?.constructor.name == 'RateLimiterMemory') limits[k] = limit._points / limit._duration;
		else limits[k] = limit;
	});

	utils.send(ws, { type: 'connected', limits });

	logger.log('info', `${ws.ip} ${ws.uuid} connected`);
};