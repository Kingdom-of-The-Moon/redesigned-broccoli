const utils = require('../utils');
const config = require('../config');

const Validator = require('jsonschema').Validator;
const v = new Validator();

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	const valid = v.validate(parse(msg), config.schemas.avatarUpload).valid;
	if (!valid) return utils.send(ws, { type: 'toast', toast: 'error', msg: 'Invalid data.' });

	ws.limits.upload.consume(1).catch(() => { return utils.rateLimited(ws) });

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