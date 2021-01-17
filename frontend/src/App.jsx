import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminView from "./AdminView";
import PlayerView from "./PlayerView";

let ws = new WebSocket("ws://localhost:8080/");
const WS_RETRY_TIME = 5000;

toast.configure({ draggable: false, autoClose: 8000 });

const DEFAULT_USER = { uid: -1, name: undefined, uid2: -1, name2: undefined };

function App() {
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [courtStatus, setCourtStatus] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  const genRandID = () => {
    return Math.floor(Math.random() * 1000);
  };

  const wsReconnect = () => {
    setTimeout(() => {
      console.log("WS - attempt reconnect");
      if (ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket("ws://localhost:8080/");
        // wss://cal-badminton.herokuapp.com/
        if (ws.readyState !== WebSocket.OPEN) {
          console.log("WS - failed reconnect");
          wsReconnect();
        } else {
          console.log("WS - successfully connected");
        }
      } else if (ws.readyState === WebSocket.OPEN) {
        console.log("WS - successfully connected, attaching handlers");
        attachWSHandlers(ws);
        // Set manually here because handlers weren't connected in time to catch open
        setWsConnected(true);
        ws.send(JSON.stringify({ type: "request", value: "queue" }));
      }
    }, WS_RETRY_TIME);
  };

  const wsSend = msg => {
    ws.send(msg);
  };

  const attachWSHandlers = client => {
    client.addEventListener("open", function(event) {
      console.log("WS Open");
      setWsConnected(true);
    }); 
    client.addEventListener("close", function(event) {
      console.log("WS Close");
      setWsConnected(false);
      wsReconnect();
    });
    client.addEventListener("message", function(event) {
      const msg = JSON.parse(event.data);
      console.log(msg.notifContent);
      console.log(event);
      if (msg.type === "queue") {
        if (!Array.isArray(msg.value)) {
          console.log("WS ERROR: queue not array");
          setUsers([]);
        } else {
          const newUsers = msg.value;
          setUsers(newUsers);
        };
      } else if (msg.type === "notification" && 'Notification' in window) {
        // Check to make sure msg is correct
        let notifContent = msg.notifContent;
        if (!notifContent) {
          console.log("Missing notifcontent");
          return;
        }
        console.log(notifContent);
        let n = new Notification(notifContent.title, {
          body: notifContent.body || ""
        });
        n.onclick = () => {
          console.log("Notif click, goto: " + notifContent.link);
          window.open(notifContent.link, "_blank");
        };
        toast.success(notifContent.title);
      } else if (msg.type === "ping") {
        let pingMsgResp = JSON.stringify({
          type: "pingres",
          timestamp: new Date(),
          id: msg.id
        });
        ws.send(pingMsgResp);
      } else if (msg.type === "courts") {
        //TODO:
        if (!Array.isArray(msg.value)) {
          console.log("WS ERROR: court info not array");
          setCourtStatus([]);
        } else {
          console.log("courtstatus", msg.value);
          const newCourtStatus = msg.value;
          setCourtStatus(newCourtStatus);
        };
      }
    });
  };

  // Update websocket record in backend
  useEffect(() => {
    // Make sure user is set and websocket is connected
    if (user && wsConnected) {
      ws.send(
        JSON.stringify({
          type: "updateid",
          uid: user.uid
        })
      );
    }
  }, [user, wsConnected]);

  useEffect(() => {
    if (!Cookies.get("user")) {
      Cookies.set(
        "user",
        { uid: genRandID(), name: DEFAULT_USER.name },
        { expires: 7 }
      );
    }
    setUser(JSON.parse(Cookies.get("user")));
   
    if (!Cookies.get("courtStatus")) {
      Cookies.set("courtStatus", [], { expires: 2 });
    }
    console.log("cookie", Cookies.get("courtStatus"));
    setCourtStatus(JSON.parse(Cookies.get("courtStatus")));
    attachWSHandlers(ws);

    if ('Notification' in window) { 
      try {
      Notification.requestPermission().then(function(result) {
        console.log("Notif request perm: " + result);
        if (result !== "granted") {
          toast.error("Please allow notifications and refresh the page!");
        }
    })} catch (error) {
        return false; 
      }
    };
  }, []);

  /* TODO Notifications:
        - If device doesnt support notifications (prop: notSupported)
        - If user declines notifications (prop: onPermissionDenied, askAgain=true to request again)
        - props.options (body, tag, icon)
  */

  const updateUser = newUser => {
    console.log("NEW USER: ", newUser);
    Cookies.set("user", newUser, { expires: 7 });
    setUser(newUser);
  };

  const updateCourts = newCourts => {
    console.log("NEW COURTS: ", newCourts);
    Cookies.set("courts", newCourts, { expires: 2 });
    setCourtStatus(newCourts);
  }


  return (
    <div>
      <Router>
        <Switch>
          <Route path="/calbadofficer">
            <AdminView 
              user={user} 
              users={users} 
              ws={ws} 
              courtStatus={courtStatus} 
              courtUpdateFunction = {updateCourts}
            />
          </Route>
          <Route path="/">
            <PlayerView
              user={user}
              users={users}
              userUpdateFunction={updateUser}
              wsSend={wsSend}
              courtStatus={courtStatus}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
