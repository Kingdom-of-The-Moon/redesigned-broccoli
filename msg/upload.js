const utils = require('../utils');
const config = require('../config');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	ws.limits.upload.consume(ws.ip, 1).then(async () => {
		const v = utils.validate(msg, utils.schemas.avatarUpload);
		if (!v.valid) return utils.send(ws, { type: 'toast', toast: 'error', top: 'upload_error', bottom: 'upload_invalid' });

		const l = config.limits[ws.rank];

		if (Buffer.byteLength(msg.data) > l.maxAvatarSize) return utils.send(ws, { type: 'toast', top: 'upload_error', bottom: 'upload_too_big' });

		const avatars = await mongo.collection('avatars').countDocuments({ uuid: ws.uuid });

		if (avatars > l.maxAvatars) return utils.send(ws, { type: 'toast', toast: 'error', top: 'upload_error', bottom: 'upload_too_many' });

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

		utils.send(ws, { type: 'toast', toast: 'default', top: 'upload_success' });

		events.emit(ws.uuid, { type: 'upload', id: msg.id });

		logger.log('info', `${ws.ip} ${ws.uuid} uploaded avatar ${msg.id}`);
	}).catch(() => { return utils.rateLimited(ws, 'upload') });
}