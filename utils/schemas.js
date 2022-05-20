module.exports.avatarUpload = {
	type: 'object',
	properties: {
		id: { type: 'string', minLength: 1, maxLength: 32 },
		metadata: {
			type: 'object',
			properties: {
				name: { type: 'string', minLength: 1, maxLength: 32 },
				author: { type: 'string', minLength: 1, maxLength: 32 },
				description: { type: 'string', minLength: 1, maxLength: 128 },
				tags: { type: 'array', items: { type: 'string', minLength: 1, maxLength: 32 } }
			}
		},
		avatarData: { type: 'buffer' }
	}
}