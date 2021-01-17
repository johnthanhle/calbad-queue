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
    var userInput = Number(event.target.value);
    if (Number.isNaN(userInput)) {
      setNumCourts(props.defaultNumber);
    } else {
      setNumCourts(userInput);
    }
    
  };

  const save = () => {
    //update court list as necessary, then update backend and cookie
    var targetNumber = numCourts;
    var numNeeded;
    var newCourts;
    if (!Number.isInteger(targetNumber)) {
        console.log('Invalid input');
        return; 
    } else {
        if (true || courtStatus.length > targetNumber) {
          //Fix Later, too tired, logic is broken, works for now by replacing everything lol
            //check if it is possible to free court if not throw error
            /*
            var cantFree = 0;
            for (var j = 0; j < courtStatus.length; j++) {
              if (!(courtStatus[j].isFree)) {
                cantFree += 1; 
              }
            }
            if (targetNumber < cantFree) {
                console.log('All courts are in use, please mark the court open if you want to remove it!');
                setNumCourts(courtStatus.length);
                return; */
            // } else {
            if (targetNumber > 10) {
              console.log('Too many courts!');
              setNumCourts(courtStatus.length);
              return;
            } else if (targetNumber > courtStatus.length) {
              const length = courtStatus.length;
              while (targetNumber > length) {
                courtStatus.push({uid: genRandID(), pair1: null, pair2: null, isFree: true});
                targetNumber -= 1; 
              }
              return; 
            }
            const numPop = courtStatus.length - targetNumber;
            for (var i = 0; i < numPop; i++) {
                courtStatus.pop(courtStatus[i]);
            } 
            props.updateBackend(courtStatus);
            props.updateCookie(courtStatus);
            setIsEdit(false);
            return; 
        } else if (false && courtStatus.length < targetNumber) {
            if (targetNumber > 10) {
              console.log('Too Many Courts!');
              return; 
            } else {
              newCourts = [];
              numNeeded = targetNumber;
              while (numNeeded > 0) {
                  newCourts.push({uid: genRandID(), pair1: null, pair2: null, isFree: true});
                  numNeeded -= 1;
              }
              setCourtStatus(newCourts);
              props.updateBackend(courtStatus);
              props.updateCookie(courtStatus);
              setIsEdit(false);
            }
        }
    }
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
