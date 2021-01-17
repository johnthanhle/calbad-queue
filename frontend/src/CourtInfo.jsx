import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Edit, Check } from "@material-ui/icons";

const CourtInfo = props => {
  const [isEdit, setIsEdit] = useState(false);
  const [numCourts, setNumCourts] = useState(0);


  const handleTextboxUpdate = event => {
    setNumCourts(Number(event.target.value));
  };

  const save = () => {
    if (numCourts === undefined || numCourts <= 0 || !Number.isInteger(numCourts)) {
        setNumCourts(0);
    }
    console.log("courts", numCourts);
    console.log("courtsss", props.courts);
    //TODO get old info and replace
    props.updateBackend(numCourts);
    props.updateCookie(numCourts);
    setIsEdit(false);
  };

  return (
    <div>
      {!isEdit && (
        <h4 onClick={() => setIsEdit(true)}>
          Number of Courts: {props.courts.length} <Edit fontSize="small" />
        </h4>
      )}
      {isEdit && (
        <div>
          <TextField
            value={numCourts === props.defaultNumber ? "" : numCourts}
            onChange={handleTextboxUpdate}
            onBlur={save}
            label="Number of Courts"
            variant="outlined"
            size="small"
          />
          <Check onClick={save} />
        </div>
      )}
    </div>

  );
};

export default CourtInfo;
