import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Edit, Check } from "@material-ui/icons";

const CourtInfo = props => {
  const [isEdit, setIsEdit] = useState(false);
  const [courtStatus, setCourtStatus] = useState(props.courts);
  const [numCourts, setNumCourts] = useState(props.courts.length);

  useEffect(() => {
    var targetNumber = numCourts;
    var numNeeded;
    if (!Number.isInteger(targetNumber)) {
      console.log('Invalid input');
      setNumCourts(courtStatus.length);
      return; 
    } else if (targetNumber > 10) {
      console.log('Too many courts!');
      setNumCourts(courtStatus.length);
      return;
    } else {
      //three cases: add, delete or do nothing
      if (targetNumber > courtStatus.length) {
        //append new courts
        numNeeded = targetNumber - courtStatus.length;
        while (numNeeded > 0) {
          courtStatus.push({uid: genRandID(), pair1: null, pair2: null, isFree: true});
          numNeeded -= 1;
        }
        props.updateBackend(courtStatus);
        props.updateCookie(courtStatus);
        return;
      } else if (targetNumber < courtStatus.length) {
        // check if we have enough free courts to delete
        numNeeded = courtStatus.length - targetNumber;
        var canFree = 0;
        var canFreeIndex = [];
        for (let i = 0; i < courtStatus.length; i++) {
          if (courtStatus[i].isFree) {
            canFree += 1;
            canFreeIndex.push(i);
          }
        }
        console.log("to pop", canFreeIndex);
        console.log("old", courtStatus);
        if (canFree >= numNeeded) {
          for (let i = 0; i < numNeeded; i++) {
            const popInd = canFreeIndex.length - 1 - i;
            courtStatus.splice(canFreeIndex[popInd], 1);
          }
          props.updateBackend(courtStatus);
          props.updateCookie(courtStatus);
          return;
        } else {
          console.log('All courts are in use, please mark the court open if you want to remove it!');
          setNumCourts(courtStatus.length);
          return;
        }

      }
    }
  }, [isEdit]);

  useEffect(() => {
    setCourtStatus(props.courts);
  }, [props.courts]);

  const genRandID = () => {
    return Math.floor(Math.random() * 1000);
  };

  const handleTextboxUpdate = event => {
    console.log("help", "help1");
    var userInput = Number(event.target.value);
    if (Number.isNaN(userInput)) {
      setNumCourts(courtStatus.length);
    } else {
      setNumCourts(userInput);
    }
    
  };

  const save = () => {
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
            value={numCourts === 0 ? '' : numCourts}
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
