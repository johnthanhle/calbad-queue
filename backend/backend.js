const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8888 });

const WEBSOCKET_PING_TIME = 40000;

let queue = [];

const genRandID = () => {
	return Math.floor(Math.random() * 1000000);
};

//let sentPings = [];

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
    	queueCopy.push({ uid: item.uid, name: item.name, uid2: item.name2, name2: item.name2});
    });
    client.send(JSON.stringify({ type: "queue", value: queueCopy }));
  };


  const notifyUser = (user, notifContent) => {
  	const uid = user.uid;
    let notificationMsg = { type: "notification", notifContent: notifContent };
    notificationMsg = JSON.stringify(notificationMsg);
    queue.forEach(item => {
      if (item.uid == uid) {
        item.ws.send(notificationMsg);
        return;
      }
    });
  };

  ws.on("close", event => {
    console.log(`Closed Connection - ${ws.id} (${wss.clients.size} total connections)`);
  });

  ws.on("message", msg =>  {
  	msg = JSON.parse(msg);
  	if (msg.type == "action") {
  		const user = msg.value;
  		if (msg.action == "add") {
  			if (!queue.some(u => u.uid == user.uid || u.uid2 == user.uid )) {
  				console.log(`+ (${user.name})(${user.uid})(${user.name2})(${user.uid2})`);
  				user.ws = ws;
		        queue.push(user);
		        wss.clients.forEach(sendQueue);
  			} else {
          const {notifContent} = "Already in the queue!";
          console.log(`* ${user.name}(${user.uid})`);
          notifyUser(user, notifContent);
  			}
  		}
  		if (msg.action == "remove") {
        if (queue.some(u => u.uid == user.uid)) {
          for (var i = 0; i < queue.length; i++) {
            if (queue[i].uid == user.uid) {
              queue.splice(i, 1);
            }
          }
          wss.clients.forEach(sendQueue);
        }
  		} else if (msg.action == "sendnotif") {
  			const {notifContent} = msg;
  			console.log(`* ${user.name}(${user.uid})`);
       		notifyUser(user, notifContent);
  		}
  	}
  else if (msg.type == "pingres") {
  	console.log(`   Ping res:  ${msg.id}`);
  } else if (msg.type === "request") {
  	if (msg.value === "queue") {
  		sendQueue(ws);
  	}
  } else if (msg.type === "updateid") {
  	let found = false;
  	for (var i = 0; i < queue.length; i++) {
  		if (queue[i].uid === msg.uid) {
	  		found = true;
	  		queue[i].ws = ws;
  		}
  	}
  	console.log(`└ Updateid ${msg.uid} (found: ${found})`);
  }
});
sendQueue(ws);
clientKeepAlive(ws);
});
