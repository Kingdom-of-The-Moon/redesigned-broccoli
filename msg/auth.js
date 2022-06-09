const utils = require('../utils');
const config = require('../config');
const { RateLimiterMemory } = require('rate-limiter-flexible');

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
				lastUsed: Date.now()
			}
		});
	}

	if (!user) { // PLEASE make this not stupid.
		user = {
			uuid: uuid,
			rank: 'default',
			equipped: [],
			lastUsed: Date.now()
		}
		await mongo.collection('users').insertOne(user);
	}

	ws.rank = user.rank;

	ws.limits = config.limits[ws.rank];

	ws.ready = true;

	utils.send(ws, { type: 'connected' });

	console.log(`${ws.uuid} connected.`);
};