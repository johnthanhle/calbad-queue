import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const PlayerInfo = (props) => {
  const [userName, setUserName] = useState(props.user.name);
  const [partnerName, setPartnerName] = useState(props.user.partnerName);
  const [badmintonEvent, setBadmintonEvent] = useState(
    props.user.event || "Doubles"
  );

  const handleSelectChange = (event) => {
    if (
      event.target.value === "Singles" &&
      partnerName &&
      partnerName.trim().length > 0
    ) {
      alert("You cannot have a partner if you are playing singles!");
      return;
    }
    setBadmintonEvent(event.target.value);
  };

  const handleTextBoxUpdate = (event) => {
    setUserName(event.target.value);
  };

  const handlePartnerTextBoxUpdate = (event) => {
    setPartnerName(event.target.value);
  };

  const handleSave = () => {
    const newUser = {};
    Object.assign(newUser, props.user);
    if (
      userName === undefined ||
      userName === null ||
      userName.trim().length <= 0
    ) {
      do {
        newUser.name = prompt("Please enter your name below!");
      } while (newUser.name === null || newUser.name.trim() === "");
      setUserName(newUser.name);
    } else {
      newUser.name = userName;
    }
    newUser.event = badmintonEvent;
    if (
      badmintonEvent === "Singles" &&
      partnerName &&
      partnerName.trim().length > 0
    ) {
      alert("You cannot have a partner if you are playing singles!");
      setPartnerName("");
      return;
    }
    if (partnerName && partnerName.trim().length <= 0) {
      newUser.partnerName = undefined;
    } else {
      newUser.partnerName = partnerName;
    }
    props.updateUser(newUser);
  };

  useEffect(() => {
    handleSave();
  }, [badmintonEvent]);

  return (
    <Grid container direction={"row"} spacing={1}>
      <Grid item>
        <TextField
          value={userName === props.defaultUser.name ? "" : userName}
          onChange={handleTextBoxUpdate}
          required={true}
          label="Name"
          variant="filled"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          onBlur={() => handleSave()}
        />
      </Grid>
      <Grid item>
        <TextField
          value={
            setPartnerName === props.defaultUser.partnerName ? "" : partnerName
          }
          onChange={handlePartnerTextBoxUpdate}
          label="Partner Name"
          variant="filled"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          onBlur={() => handleSave()}
        />
      </Grid>
      <Grid item>
        <FormControl variant="filled" size="small" required={true}>
          <InputLabel>Event</InputLabel>
          <Select
            label="Event"
            value={badmintonEvent}
            displayEmpty
            onChange={handleSelectChange}
          >
            <MenuItem value={"Singles"}>Singles</MenuItem>
            <MenuItem value={"Doubles"}>Doubles</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PlayerInfo;
