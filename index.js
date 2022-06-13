const { MongoClient } = require('mongodb');
const { createClient } = require('redis');
const { WebSocketServer } = require('ws');
const os = require('os');
const EventEmitter = require('events');
const fs = require('fs');
const utils = require('./utils');

const events = new EventEmitter();
const wss = new WebSocketServer({ port: 25500 });

const mongo = new MongoClient('mongodb://admin:securePassword123@192.168.1.119:27017/?authMechanism=DEFAULT');
const redis = new createClient({
	host: '127.0.0.1',
	port: 6379
});

console.clear();

(async () => {
	await mongo.connect();
	await redis.connect();
	figura = mongo.db('figura');
	console.log('Figura backend is online.');
})();

const msgTypes = {};

fs.readdirSync("./msg").forEach(file => {
	if (!file.endsWith(".js")) return;
	const msgType = file.substring(0, file.lastIndexOf("."));
	msgTypes[msgType] = require("./msg/" + file);
});

const connections = [];

wss.on("connection", (ws, req) => {
	ws.ip = req.socket.remoteAddress;

	if (ws.ip in connections) {
		if (connections[ws.ip].length >= 5) {
			ws.close(4003, "Too many connections.");
		}
	} else {
		connections[ws.ip] = [];
	}

	connections[ws.ip].push(ws);

	ws.on("message", async (wsmsg) => {
		try {
			let msg = utils.parse(wsmsg);
			if (!msg.type) return utils.send(ws, { type: "system", message: `$ Invalid message.` });
			const cmd = msgTypes[msg.type];
			if (!cmd) return utils.send(ws, { type: "system", message: `$ Type not implemented.` });
			await cmd(wss, ws, msg, events, figura, redis);
			console.log('recv', ws.uuid, msg);
		} catch (e) {
			console.error(e);
			console.log(wsmsg);
			utils.send(ws, { type: "system", message: `$ Something went wrong.` });
		}
	});

	ws.on('close', () => {
		utils.close(wss, ws, events, mongo, redis);
		connections[ws.ip].splice(connections[ws.ip].indexOf(ws), 1);
	});

	ws.ready = false;
	ws.isAlive = true;

	ws.subscribedTo = {};

	setTimeout(() => {
		if (!ws.ready) ws.close();
	}, 2000);
});

setInterval(() => {
	events.emit('system', {
		memory: {
			process: process.memoryUsage().heapUsed,
			used: os.totalmem() - os.freemem(),
			total: os.totalmem(),
			free: os.freemem()
		},
		uptime: {
			process: process.uptime(),
			system: os.uptime()
		}
	});
}, 1000);

setInterval(() => {
	wss.clients.forEach(ws => {
		if (ws.isAlive === false) return ws.terminate();
		ws.isAlive = false;
		utils.send(ws, { type: "keepalive" });
	});
}, 30000);