const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	if (!msg.avatarData || !msg.uuid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid avatar data.' });

	ws.limits.upload.consume(1).catch(() => { return });

	const l = config.limits[ws.rank];

	if (Buffer.byteLength(ws.avatarData) > l.maxAvatarSize) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Your avatar is too large.' });

	const avatars = await mongo.collection('avatars').countDocuments({ uuid: ws.uuid });

	if (avatars > l.maxAvatars) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'You have too many avatars.' });

	await mongo.collection('avatars').insertOne({
		owner: ws.uuid,
		uuid: msg.uuid,
		data: msg.avatarData
	});

	utils.send(ws, { type: 'toast', toast: 'default', msg: 'Avatar uploaded.' });
}