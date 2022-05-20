const utils = require('./index');

module.exports = (ws) => {
	utils.send(ws, { type: 'toast', toast: 'error', msg: 'rate limited' });
}