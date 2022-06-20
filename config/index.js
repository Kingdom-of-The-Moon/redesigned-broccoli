const { readFileSync } = require('fs');
module.exports = {
	limits: require('./limits'),
	mongoUrl: readFileSync('../mongo.url', 'utf-8').trim()
}