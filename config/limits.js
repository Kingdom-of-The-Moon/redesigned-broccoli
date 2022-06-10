const { RateLimiterMemory } = require("rate-limiter-flexible");

module.exports = {
	default: {
		maxAvatarSize: 1024 * 100,
		maxAvatars: 10,
		allowedBadges: [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
		pingSize: new RateLimiterMemory({ points: 1024, duration: 1, }),
		pingRate: new RateLimiterMemory({ points: 32, duration: 1 }),
		equip: new RateLimiterMemory({ points: 1, duration: 1 }),
		download: new RateLimiterMemory({ points: 30, duration: 1 }),
		upload: new RateLimiterMemory({ points: 1, duration: 3 })
	},
	donator: {
		maxAvatarSize: 1024 * 100,
		maxAvatars: 20,
		allowedBadges: [1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0],
		pingSize: new RateLimiterMemory({ points: 1024, duration: 1, }),
		pingRate: new RateLimiterMemory({ points: 32, duration: 1 }),
		equip: new RateLimiterMemory({ points: 1, duration: 1 }),
		download: new RateLimiterMemory({ points: 30, duration: 1 }),
		upload: new RateLimiterMemory({ points: 1, duration: 3 })
	},
	vip: {
		maxAvatarSize: 1024 * 100,
		maxAvatars: 20,
		allowedBadges: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		pingSize: new RateLimiterMemory({ points: 1024, duration: 1, }),
		pingRate: new RateLimiterMemory({ points: 32, duration: 1 }),
		equip: new RateLimiterMemory({ points: 1, duration: 1 }),
		download: new RateLimiterMemory({ points: 30, duration: 1 }),
		upload: new RateLimiterMemory({ points: 1, duration: 3 })
	}
}