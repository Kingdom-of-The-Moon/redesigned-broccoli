const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis) => {
	if (!ws.ready) return;

	ws.limits.upload.consume(ws.ip, 1).then(async () => {
		const v = utils.validate(msg, utils.schemas.avatarUpload);
		if (!v.valid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'Upload Error', bottom: 'Invalid data.' });

		const l = config.limits[ws.rank];

		if (Buffer.byteLength(msg.data) > l.maxAvatarSize) return utils.send(ws, { type: 'toast', top: 'Upload Error', bottom: 'Your avatar is too large.' });

		const avatars = await mongo.collection('avatars').countDocuments({ uuid: ws.uuid });

		if (avatars > l.maxAvatars) return utils.send(ws, { type: 'toast', toast: 'error', top: 'Upload Error', bottom: 'You have too many avatars.' });

		/*
		await mongo.collection('avatars').insertOne({
			owner: ws.uuid,
			id: msg.id,
			data: msg.data
		});
		*/

		await mongo.collection('avatars').updateOne({ owner: ws.uuid, id: msg.id }, {
			$set: {
				data: msg.data
			}
		}, { upsert: true });

		utils.send(ws, { type: 'toast', toast: 'default', top: 'Notice', bottom: 'Avatar uploaded.' });

		events.emit(ws.uuid, { type: 'upload', id: msg.id });
	}).catch(() => { return utils.rateLimited(ws, 'upload') });
}