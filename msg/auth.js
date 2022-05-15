const utils = require('../utils');
const config = require('../config');
const { RateLimiterMemory } = require('rate-limiter-flexible');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (ws.ready) return;

	if (!msg.code) return ws.close();

	const uuid = await redis.get(msg.code);

	if (!uuid) return ws.close();

	ws.uuid = uuid;

	let user = await mongo.collection('users').findOne({ uuid: uuid });

	if (user) {
		await mongo.collection('users').updateOne({ uuid: uuid }, {
			$set: {
				lastUsed: Date.now()
			}
		});
	}

	if (!user) {
		user = {
			uuid: uuid,
			rank: 'default',
			equipped: [],
			lastUsed: Date.now()
		}
		await mongo.collection('users').insertOne(user);
	}

	ws.rank = user.rank;

	const l = config.limits[ws.rank];

	ws.limits = {
		pingSize: new RateLimiterMemory({
			points: l.pingSize[0],
			duration: l.pingSize[1]
		}),
		pingRate: new RateLimiterMemory({
			points: l.pingRate[0],
			duration: l.pingRate[1]
		}),
		download: new RateLimiterMemory({
			points: l.download[0],
			duration: l.download[1]
		}),
		upload: new RateLimiterMemory({
			points: l.upload[0],
			duration: l.upload[1]
		})
	}

	ws.ready = true;

	utils.send(ws, { type: 'connected' });

	console.log(`${ws.uuid} connected.`);
};