import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Edit, Check } from "@material-ui/icons";

const CourtInfo = props => {
  const [isEdit, setIsEdit] = useState(false);
  const [courtStatus, setCourtStatus] = useState(props.courts);
  const [numCourts, setNumCourts] = useState(props.courts.length);

  const genRandID = () => {
    return Math.floor(Math.random() * 1000);
  };

  const handleTextboxUpdate = event => {
    setNumCourts(event.target.value);
  };

  const save = () => {
    //update court list as necessary, then update backend and cookie
    const targetNumber = numCourts;
    if (!Number.isInteger(targetNumber)) {
        //TODO: throw error

    } else {
        if (courtStatus.length < targetNumber) {
            //check if it is possible to free court if not throw error
            var canFree = courtStatus.filter(function (item) {
                return item.isFree;
            });
            var numNeeded = targetNumber - courtStatus.length;
            if (numNeeded > canFree.length) {
                //throw error since can't free enough courts
            } else {
                var newCourts = Object.assign(courtStatus);
                for (var i = 0; i < numNeeded; i++) {
                    const itemToPop = canFree[i];
                    const ind = newCourts.indexOf(itemToPop);
                    newCourts.pop(ind);
                }
                setCourtStatus(newCourts);
                props.updateBackend(courtStatus);
                props.updateCookie(courtStatus);
                setIsEdit(false);
            }
        } else if (courtStatus.length > targetNumber) {
            var numNeeded = courtStatus.length - targetNumber;
            var newCourts = Object.assign(courtStatus);
            while (numNeeded > 0) {
                newCourts.push({uid: genRandID(), pair1: null, pair2: null, isFree: true})
                numNeeded -= 1;
            }
            setCourtStatus(newCourts);
            props.updateBackend(courtStatus);
            props.updateCookie(courtStatus);
            setIsEdit(false);

        }
    }
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
