const utils = require('../utils');

module.exports = async (wss, ws, msg, events, mongo, redis, clients, logger) => {
	if (!ws.ready) return;

	let m = 0;

	let b = 2000;

	setTimeout(() => {
		utils.send(ws, { type: 'toast', toast: 'default', raw: true, top: 'thing', bottom: '{"translate":"figura.gui.help.tooltip"}' });
	}, m++ * b);

	ws.close(4000);

	/*setTimeout(() => {
		utils.send(ws, { type: 'toast', toast: 'warning', raw: true, top: '{"text":"never gonna","color":"#FFFF00"}', bottom: '{"text":"let you down","color":"#008000"}' });
	}, m++ * b);

	setTimeout(() => {
		utils.send(ws, { type: 'toast', toast: 'error', raw: true, top: '{"text":"never gonna","color":"#0000FF"}', bottom: '{"text":"run around","color":"#4B0082"}' });
	}, m++ * b);

	setTimeout(() => {
		utils.send(ws, { type: 'toast', toast: 'cheese', raw: true, top: '{"text":"and hurt you","color":"#EE82EE"}', bottom: '<3 hehe' });
	}, m++ * b);*/
}