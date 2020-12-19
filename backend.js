const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 6969 });

const WEBSOCKET_PING_TIME = 40000;

let queue = [ 
	{ uid: 69, name: "Bianca Chow Ling Tam", uid2: 96, name2: "Rando carry", ws: null },
	{ uid: 69, name: "Bianca Chow Ling Tam", uid2: -1, name2: null, ws: null },
	];

const genRanID = () => {
	return Math.floor(Math.random() * 100);
};

let sentPings = [];

let pingMsg = { type: "ping", timestamp: new Date() };

const pingClient = client => {
  pingMsg.id = client.id;
  console.log(`   Ping sent: ${pingMsg.id}`);
  client.send(JSON.stringify(pingMsg));
}; 

const clientKeepAlive = client => {
  setTimeout(() => {
    if (client.readyState === WebSocket.CLOSED) {
      return;
    }
    pingClient(client);
    clientKeepAlive(client);
  }, WEBSOCKET_PING_TIME);
};

wss.on("connection", ws => {
  ws.id = genRandID();
  console.log(`Opened Connection - ${ws.id} (${wss.clients.size} total connections)`);
  const sendQueue = client => {
    let queueCopy = [];
    queue.forEach(item => {
    	if (item.uid2 != null) {
    		queueCopy.push({ uid: item.uid, name: item.name, uid2: item.name2, name2: item.name2});
    	} else {
    		queueCopy.push({ uid: item.uid, name: item.name});
    	}
    });
    client.send(JSON.stringify({ type: "queue", value: queueCopy }));
  };

