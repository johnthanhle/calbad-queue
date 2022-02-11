const backend = () => {
    const WebSocket = require("ws");
    const wss = new WebSocket.Server({ port: process.env.PORT || 5000 });
    const WEBSOCKET_PING_TIME = 40000;

    let queue = [];
    let courts = [[], [], [], [], [], []];

    const generateUID = () => {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    };

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
        ws.id = generateUID();
        console.log(`Opened Connection - ${ws.id} (${wss.clients.size} total connections)`);

        const sendQueue = client => {
            let queueCopy = [];
            queue.forEach(item => {
                queueCopy.push({ uid: item.uid, name: item.name, partnerName: item.partnerName, event: item.event });
            });
            client.send(JSON.stringify({ type: "queue", value: queueCopy }));
        };

        const sendCourts = client => {
            let courtsCopy = [];
            courts.forEach(court => {
                courtCopy = []
                court.forEach(item => {
                    courtCopy.push({ uid: item.uid, name: item.name, partnerName: item.partnerName, event: item.event });
                })
                courtsCopy.push(courtCopy);
            });
            client.send(JSON.stringify({ type: "courts", value: courtsCopy }));
        }

        ws.on("close", event => {
            console.log(`Closed Connection - ${ws.id} (${wss.clients.size} total connections)`);
        });

        ws.on("message", msg => {
            msg = JSON.parse(msg);
            if (msg.action === "add-queue") {
                const user = msg.value;
                if (user.name && !queue.some(u => u.uid == user.uid)) {
                    user.ws = ws;
                    queue.push(user);
                    wss.clients.forEach(sendQueue);
                }
            } else if (msg.action === "remove-queue") {
                const user = msg.value;
                if (queue.some(u => u.uid == user.uid)) {
                    for (var i = 0; i < queue.length; i++) {
                        if (queue[i].uid == user.uid) {
                            queue.splice(i, 1);
                        }
                    }
                    wss.clients.forEach(sendQueue);
                }
            } else if (msg.action === "remove-selected") {
                const users = msg.value;
                queue = queue.filter(user => !users.includes(user.uid));
                wss.clients.forEach(sendQueue);
            } else if (msg.action === "court-add") {
                const index = msg.court;
                const users = msg.value;
                courts[index] = queue.filter(user => users.includes(user.uid));
                queue = queue.filter(user => !users.includes(user.uid));
                wss.clients.forEach(sendQueue);
                wss.clients.forEach(sendCourts);
            } else if (msg.action === "court-remove") {
                const index = msg.court;
                const users = msg.value;
                courts[index] = queue.filter(user => !users.includes(user.uid));
                wss.clients.forEach(sendCourts);
            } else if (msg.type === "request") {
                if (msg.value === "queue") {
                    sendQueue(ws);
                }
                if (msg.value === "courts") {
                    sendCourts(ws);
                }
            } else if (msg.type === "update-id") {
                let found = false;
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i].uid === msg.uid) {
                        found = true;
                        queue[i].ws = ws;
                    }
                }
                console.log(`UpdateID ${msg.uid} (found: ${found})`);
            }
        });

        sendQueue(ws);
        sendCourts(ws);
        clientKeepAlive(ws);
    });
};

module.exports.start = backend; 