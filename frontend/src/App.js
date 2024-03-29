import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CourtData from "./CourtData";
import "./App.css";

let ws = new WebSocket("wss://cal-badminton.herokuapp.com/");
const DEFAULT_USER = {
  uid: -1,
  name: undefined,
  partnerName: undefined,
  event: undefined,
  authenticated: false,
};
const WS_RETRY_TIME = 5000;

function App() {
  const tabs = ["court1", "court2", "court3", "court4", "court5", "court6"];
  const [user, setUser] = useState();
  const [courts, setCourts] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  const generateUID = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  };

  const wsReconnect = () => {
    setTimeout(() => {
      console.log("WS - attempt reconnect");
      if (ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket("wss://cal-badminton.herokuapp.com/");
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
        ws.send(JSON.stringify({ type: "request", value: "courts" }));
      }
    }, WS_RETRY_TIME);
  };

  const attachWSHandlers = (client) => {
    client.addEventListener("open", function (event) {
      console.log("WS Open");
      setWsConnected(true);
    });
    client.addEventListener("close", function (event) {
      console.log("WS Close");
      setWsConnected(false);
      wsReconnect();
    });
    client.addEventListener("message", function (event) {
      const msg = JSON.parse(event.data);
      if (msg.type === "courts") {
        if (!Array.isArray(msg.value)) {
          console.log("WS ERROR: courts not array");
          var emptyCourts = [[], [], [], [], [], []];
          setCourts(emptyCourts);
        } else {
          const newCourts = msg.value;
          setCourts(newCourts);
        }
      }
    });
  };

  useEffect(() => {
    // Make sure user is set and websocket is connected
    if (user && wsConnected) {
      ws.send(
        JSON.stringify({
          type: "update-user",
          value: user,
        })
      );
    }
  }, [user, wsConnected]);

  useEffect(() => {
    if (!Cookies.get("user")) {
      const user_data = { uid: generateUID(), name: DEFAULT_USER.name };
      Cookies.set("user", JSON.stringify(user_data), { expires: 7 });
    }
    setUser(JSON.parse(Cookies.get("user")));
    attachWSHandlers(ws);
  }, []);

  const wsSend = (msg) => {
    ws.send(msg);
  };

  const updateUser = (newUser) => {
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 });
    setUser(newUser);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <CourtData
                user={user}
                users={courts[0] === undefined ? [] : courts[0]}
                admin={false}
                courts={courts}
                courtPath={"court1"}
                defaultUser={DEFAULT_USER}
                updateUser={updateUser}
                wsSend={wsSend}
              ></CourtData>
            }
          ></Route>
          {tabs.map((tab) => (
            <Route
              path={tab}
              element={
                <CourtData
                  user={user}
                  admin={false}
                  courts={courts}
                  courtPath={tab}
                  defaultUser={DEFAULT_USER}
                  updateUser={updateUser}
                  wsSend={wsSend}
                ></CourtData>
              }
            ></Route>
          ))}
          <Route
            path="/admin"
            element={
              <CourtData
                user={user}
                admin={true}
                courts={courts}
                courtPath={"court1"}
                defaultUser={DEFAULT_USER}
                updateUser={updateUser}
                wsSend={wsSend}
              ></CourtData>
            }
          ></Route>
          {tabs.map((tab) => (
            <Route
              path={tab + "-admin"}
              element={
                <CourtData
                  user={user}
                  admin={true}
                  courts={courts}
                  courtPath={tab}
                  defaultUser={DEFAULT_USER}
                  updateUser={updateUser}
                  wsSend={wsSend}
                ></CourtData>
              }
            ></Route>
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
