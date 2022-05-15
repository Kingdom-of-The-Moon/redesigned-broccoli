const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.avatarData || !msg.name) return utils.send(ws, { type: 'error', error: 'Invalid avatar data.' });

	ws.limits.upload.consume(1).catch(() => { return });

	const l = config.limits[ws.rank];

	if (Buffer.byteLength(ws.avatarData) > l.maxAvatarSize) return utils.send(ws, { type: 'error', error: 'Your avatar is too large.' });

	const avatars = await mongo.collection('avatars').countDocuments({ uuid: ws.uuid });

	if (avatars > l.maxAvatars) return utils.send(ws, { type: 'error', error: 'You have too many avatars. Delete at least one from the Profile menu.' });

	await mongo.collection('avatars').replaceOne({ uuid: ws.uuid, name: msg.name }, {
		uuid: ws.uuid,
		name: msg.name,
		data: msg.avatarData
	}, { upsert: true });

	utils.send(ws, { type: 'uploaded', name: msg.name });
}