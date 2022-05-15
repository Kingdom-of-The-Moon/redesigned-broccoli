module.exports = {
	default: {
		maxAvatarSize: 1024 * 100,
		maxAvatars: 10,
		pingSize: [1024, 1],
		pingRate: [32, 1],
		download: [10, 1],
		upload: [1, 3]
	},
	donator: {
		maxAvatarSize: 1024 * 200,
		maxAvatars: 20,
		pingSize: [2048, 1],
		pingRate: [64, 1],
		download: [20, 1],
		upload: [1, 3]
	},
	vip: {
		maxAvatarSize: 1024 * 500,
		maxAvatars: 50,
		pingSize: [102400, 1],
		pingRate: [100, 1],
		download: [50, 1],
		upload: [1, 3]
	}
}