import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Box } from "@material-ui/core";
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
    setBadmintonEvent(event.target.value);
  };

  const handleTextBoxUpdate = (event) => {
    setUserName(event.target.value);
  };

  const handleTextBoxUpdate2 = (event) => {
    setPartnerName(event.target.value);
  };

  const handleSave = () => {
    const newUser = {};
    Object.assign(newUser, props.user);
    if (userName === undefined || userName.trim().length <= 0) {
      alert("Name cannot be empty!");
      return;
    }
    newUser.name = userName;
    newUser.event = badmintonEvent;
    if (newUser.event === "Singles" && partnerName.trim().length > 0) {
      alert("You cannot have a partner if you are playing singles!");
      return;
    }
    if (partnerName && partnerName.trim().length <= 0) {
      newUser.partnerName = undefined;
    } else {
      newUser.partnerName = partnerName;
    }
    props.updateUser(newUser);
  };

  return (
    <Box m={0.4} pt={0.4}>
      <div>
        <TextField
          value={userName === props.defaultUser.name ? "" : userName}
          onChange={handleTextBoxUpdate}
          required={true}
          label="Name"
          variant="outlined"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          onBlur={() => handleSave()}
        />
        <TextField
          value={
            setPartnerName === props.defaultUser.partnerName ? "" : partnerName
          }
          onChange={handleTextBoxUpdate2}
          label="Partner Name"
          variant="outlined"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          onBlur={() => handleSave()}
        />
        <FormControl variant="outlined" size="small" required={true}>
          <InputLabel>Event</InputLabel>
          <Select
            label="Event"
            value={badmintonEvent}
            displayEmpty
            onChange={handleSelectChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            onBlur={() => handleSave()}
          >
            <MenuItem value={"Singles"}>Singles</MenuItem>
            <MenuItem value={"Doubles"}>Doubles</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Box>
  );
};

export default PlayerInfo;
