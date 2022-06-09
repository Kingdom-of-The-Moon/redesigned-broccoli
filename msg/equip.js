const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	ws.limits.equip.consume(ws.ip, 1).then(async () => {
		const v = utils.validate(msg, utils.schemas.equip);
		if (!v.valid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid data.' });

		let user = await mongo.collection('users').findOne({ uuid: uuid });

		if (user) {
			await mongo.collection('users').updateOne({ uuid: uuid }, {
				$set: {
					equipped: avatars
				}
			});
		}

		events.emit(ws.uuid, { type: 'equip', equipped: avatars });
	}).catch(() => { return utils.rateLimited(ws, 'download') });
}