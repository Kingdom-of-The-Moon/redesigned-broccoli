const send = require('./send');

const t = new Set();

module.exports = (ws, rl) => {
	if (t.has(ws.uuid)) return;
	send(ws, { type: 'toast', toast: 'error', top: rl ? rl : 'rate_limited', bottom: rl ? 'rate_limited' : '' });
	t.add(ws.uuid);
	setTimeout(() => { t.delete(ws.uuid); }, 5000);
}