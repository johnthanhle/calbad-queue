const backend = () => {
  const WebSocket = require("ws");
  const wss = new WebSocket.Server({ port: process.env.PORT || 5000 });
  const WEBSOCKET_PING_TIME = 40000;

  let courts = [[], [], [], [], [], []];

  const generateUID = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  };

  let pingMsg = { type: "ping", timestamp: new Date() };

  const pingClient = (client) => {
    pingMsg.id = client.id;
    console.log(`   Ping sent: ${pingMsg.id}`);
    client.send(JSON.stringify(pingMsg));
  };

  const clientKeepAlive = (client) => {
    setTimeout(() => {
      if (client.readyState === WebSocket.CLOSED) {
        return;
      }
      pingClient(client);
      clientKeepAlive(client);
    }, WEBSOCKET_PING_TIME);
  };

  wss.on("connection", (ws) => {
    ws.id = generateUID();
    console.log(
      `Opened Connection - ${ws.id} (${wss.clients.size} total connections)`
    );

    const sendCourts = (client) => {
      let courtsCopy = [];
      courts.forEach((court) => {
        courtCopy = [];
        court.forEach((item) => {
          courtCopy.push({
            uid: item.uid,
            name: item.name,
            partnerName: item.partnerName,
            event: item.event,
          });
        });
        courtsCopy.push(courtCopy);
      });
      client.send(JSON.stringify({ type: "courts", value: courtsCopy }));
    };

    ws.on("close", () => {
      console.log(
        `Closed Connection - ${ws.id} (${wss.clients.size} total connections)`
      );
    });

    ws.on("message", (msg) => {
      msg = JSON.parse(msg);
      if (msg.action === "court-add") {
        const user = msg.value;
        const index = msg.court;
        let queued = false;
        for (var i = 0; i < courts.length; i++) {
          if (courts[i].some((u) => u.uid == user.uid)) {
            queued = true;
          }
        }
        if (user.name && !queued) {
          user.ws = ws;
          courts[index].push(user);
          wss.clients.forEach(sendCourts);
        }
      } else if (msg.action === "court-remove") {
        const user = msg.value;
        const index = msg.court;
        if (courts[index].some((u) => u.uid == user.uid)) {
          for (var i = 0; i < courts[index].length; i++) {
            if (courts[index][i].uid == user.uid) {
              courts[index].splice(i, 1);
            }
          }
          wss.clients.forEach(sendCourts);
        }
      } else if (msg.action === "remove-selected") {
        const users = msg.value;
        const index = msg.court;
        courts[index] = courts[index].filter(
          (user) => !users.includes(user.uid)
        );
        wss.clients.forEach(sendCourts);
      } else if (msg.type === "request") {
        if (msg.value === "courts") {
          sendCourts(ws);
        }
      } else if (msg.type === "update-user") {
        let found = false;
        var user = msg.value;
        for (var i = 0; i < courts.length; i++) {
          for (var j = 0; j < courts[i].length; j++) {
            curr_user = courts[i][j];
            if (curr_user.uid === user.uid) {
              found = true;
              curr_user.ws = ws;
              curr_user.name = user.name;
              curr_user.partnerName = user.partnerName;
              curr_user.event = user.event;
            }
          }
        }
        wss.clients.forEach(sendCourts);
        console.log(`UpdateID ${user.uid} (found: ${found})`);
      }
    });

    sendCourts(ws);
    clientKeepAlive(ws);
  });
};

module.exports.start = backend;
