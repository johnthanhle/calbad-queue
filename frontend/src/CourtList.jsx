import React from "react";
import {
  Grid,
  ListItemText,
  Typography
} from "@material-ui/core";
import courtImage from "./court.png";

const CourtList = props => {
  return (
    <div>
      <Grid container>
        {!(
          props.courts &&
          Array.isArray(props.courts) &&
          props.courts.length > 0
        ) && (
        <div class="body" align="center">
        <h2><center><b>No reserved courts!</b></center></h2>
        </div>
        )}

        {props.courts &&
          Array.isArray(props.courts) &&
          props.courts.length > 0 &&
          props.courts.map((u, i) => (
            <Grid item key={i} spacing="2">
              <div>
                <img src={courtImage} alt="Court image"/>
                <ListItemText
                disableTypography
                    primary={<Typography variant="body">
                    {"Court " + (i + 1)}
                    </Typography>
                    }
                    
                />
                {props.admin && (

                    <button 
                    onClick={ () => {
                        props.courts[i] = !props.courts[i]
                    }}
                    >
                        {u ? "Mark occupied" : "Mark free"}
                    </button>

                )}
              </div>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default CourtList;
