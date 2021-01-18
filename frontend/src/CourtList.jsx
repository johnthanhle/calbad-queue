import React, { useState, useEffect } from "react";
import {
  Grid,
  ListItemText,
  Typography,
  Button, 
} from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import courtImage from "./court.png";

const CourtList = props => {
  const [court, editCourt] = useState(props.courtStatus);

  const save = newCourt => {
    props.updateBackend(newCourt);
    props.updateCookie(newCourt);
  };

  useEffect(() => {
    editCourt(props.courtStatus);
  }, [court, props.courtStatus]);

  if (!(
      court &&
      Array.isArray(court) &&
      court.length > 0
    )) {
      return (
    <div class="body" align="center">
    <h2><center><b>No reserved courts!</b></center></h2>
    </div>)
    }
  return (
    <div>
      <Grid container spacing={2}>
        {court &&
          Array.isArray(court) &&
          court.length > 0 &&
          court.map((u, i) => (
            <Grid item key={i}>
              <div>
                <img src={courtImage} alt=""/>
                <ListItemText
                disableTypography
                    primary={<Typography variant="body">
                    {"Court " + (i + 1)}
                    </Typography>
                    } 
                />
                <ListItemText
                disableTypography
                    primary={
                    <div style={{ display: "flex" }}>
                    <Typography variant="body" style={{ marginRight: 3}}>
                    Status: 
                    </Typography>
                    <Typography variant="body">
                      {!court[i].isFree ? <CancelIcon/> : <CheckCircleIcon /> }
                    </Typography>
                    </div>
                    } 
                />
                {props.admin && (
                    <Button
                      onClick={ () => save(court.map(item => 
                        item.uid === court[i].uid ? 
                        {uid: item.uid, pair1: item.pair1, pair2: item.pair2, isFree: !item.isFree}
                        : item))}
                      color="primary"
                      variant="contained"
                    >
                    {court[i].isFree ? "Mark occupied" : "Mark free"}
                    </Button>
                )}
              </div>
              <br></br>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default CourtList;
