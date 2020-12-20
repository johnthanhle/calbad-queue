import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Edit, Check } from "@material-ui/icons";

const PlayerInfo = props => {
  const [isEdit, setIsEdit] = useState(false);
  const [userName, setUserName] = useState(props.user.name);
  const [userName2, setUserName2] = useState(props.user.name2)

  const handleTextboxUpdate = event => {
    setUserName(event.target.value);
  };

  const handleTextboxUpdate2 = event => {
    setUserName2(event.target.value);
  };

  const save = () => {
    const newUser = {};
    Object.assign(newUser, props.user);
    if (userName == undefined) {
      return; 
    }
    newUser.name = userName
    newUser.name2 = userName2;
    props.updateFunction(newUser);
    setIsEdit(false);
  };

  return (
    <div>
      {!isEdit && (
        <h4 onClick={() => setIsEdit(true)}>
          Name: {props.user.name} <br></br> Partner: {props.user.name2} <Edit fontSize="small" />
        </h4>
      )}
      {isEdit && (
        <div>
          <TextField
            value={userName === props.defaultUser.name ? "" : userName}
            onChange={handleTextboxUpdate}
            onBlur={save}
            label="Name"
            variant="outlined"
            size="small"
          />
          <TextField
            value={userName2 === props.defaultUser.name2 ? "" : userName2}
            onChange={handleTextboxUpdate2}
            onBlur={save}
            label="Partner Name"
            variant="outlined"
            size="small"
          />
          <Check onClick={save} />
        </div>
      )}
    </div>

  );
};

export default PlayerInfo;
