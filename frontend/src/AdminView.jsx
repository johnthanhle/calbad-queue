import React from "react";
import { Container } from "@material-ui/core";
import PlayerList from "./PlayerList";

const AdminView = props => {

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
