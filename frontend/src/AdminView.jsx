import React from "react";
import { Container } from "@material-ui/core";
import PlayerList from "./PlayerList";
import CourtList from "./CourtList";
import CourtInfo from "./CourtInfo";

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

  //TODO: add and remove courts
  const updateCourtStatus = courts => {
    const msg = { type: "action", action: "courtStatusUpdate", value: courts};
    props.ws.send(JSON.stringify(msg));
  }

  const updateCourtNum = newNum => {
    const msg = { type: "action", action: "courtNumberUpdate", value: newNum}
    props.ws.send(JSON.stringify(msg));
  }

  return (
    <Container maxWidth="sm">
      <h1><center>Open Gym Admin</center></h1>
      <PlayerList
        users={props.users}
        admin={true}
        notifyFunction={notifyFunction}
        removeUserFunction={removeUser}
      />
      <CourtInfo 
        courts={props.courtStatus}
        defaultNumber={0}
        updateBackend={updateCourtNum}
        updateCookie={props.courtUpdateFunction}
      />
      <CourtList 
        courts={props.courtStatus}
        admin={true}
        updateStatusFunction={updateCourtStatus}
      />
      

    </Container>
  );
};

export default AdminView;
