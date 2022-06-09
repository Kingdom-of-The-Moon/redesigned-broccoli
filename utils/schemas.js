module.exports.avatarUpload = {
	type: 'object',
	properties: {
		id: { type: 'string', minLength: 1, maxLength: 32 },
		data: { type: 'string' }
	}
}

module.exports.equip = {
	type: 'object',
	properties: {
		owner: { type: 'string', minLength: 1, maxLength: 64 },
		avatars: { type: 'array', items: { type: 'object', properties: {
			owner: { type: 'string', minLength: 36, maxLength: 36 },
			id: { type: 'string', minLength: 1, maxLength: 32 }
		}, minLength: 1, maxLength: 20 } }
	}
}

/*
reserved for future use in avatar browser

		metadata: {
			type: 'object',
			properties: {
				name: { type: 'string', minLength: 1, maxLength: 32 },
				author: { type: 'string', minLength: 1, maxLength: 32 },
				description: { type: 'string', minLength: 1, maxLength: 128 },
				tags: { type: 'array', items: { type: 'string', minLength: 1, maxLength: 32 } }
			}
		},

*/