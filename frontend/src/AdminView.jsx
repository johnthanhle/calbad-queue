import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import Cookies from "js-cookie";

import PlayerList from "./PlayerList";

const AdminView = props => {
  const [meetingLink, setMeetingLink] = useState(null);

  const notifyFunction = user => {
    const notifContent = {
      title: "It's your turn to play!",
      body: "Please go to your court",
    };
    const msg = {
      type: "action",
      action: "sendnotif",
      value: user,
      notifContent: notifContent
    };
    props.ws.send(JSON.stringify(msg));
  };

  const removeUser = user => {
    const msg = { type: "action", action: "remove", value: user };
    props.ws.send(JSON.stringify(msg));
  };

  useEffect(() => {
    if (!Cookies.get("ta")) {
      console.log("no c");
      Cookies.set("ta", { meetingLink: null });
    } else {
      const ta = JSON.parse(Cookies.get("ta"));
      setMeetingLink(ta.meetingLink);
    }
  }, []);

  useEffect(() => {
    Cookies.set("ta", { meetingLink: meetingLink }, { expires: 7 });
  }, [meetingLink]);

  return (
    <Container maxWidth="sm">
      <h1><center>Open Gym Admin</center></h1>
      <PlayerList
        users={props.users}
        admin={true}
        notifyFunction={notifyFunction}
        removeUserFunction={removeUser}
      />
    </Container>
  );
};

export default AdminView;
