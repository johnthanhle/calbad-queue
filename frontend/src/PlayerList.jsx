import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import { Clear, Notifications } from "@material-ui/icons";
import logo from './logo.png';

const PlayerList = props => {
  return (
    <div>
      <List>
        {!(
          props.users &&
          Array.isArray(props.users) &&
          props.users.length > 0
        ) && (
        <div class="body">
        <h2><center><b>Queue is currently empty!</b></center></h2>
        <br></br>
          <Box display="flex" justifyContent="center">
            <img src={logo} alt="Queue is empty" />
          </Box>
        </div>
        )}

        {props.users &&
          Array.isArray(props.users) &&
          props.users.length > 0 &&
          props.users.map((u, i) => (
            <ListItem key={i}>
              <ListItemText
              disableTypography
                primary={<Typography variant="body">
                  {(u.name2) ? (i + 1 + ". " + u.name + ", " + u.name2) : (i + 1 + ". " + u.name)}
                  </Typography>
                }
              />
              {props.admin && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="notification" onClick={() => {props.notifyFunction(u)}}>
                    <Notifications />
                  </IconButton>
                  <IconButton edge="end" aria-label="close" onClick={() => {props.removeUserFunction(u)}}>
                    <Clear color="secondary" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default PlayerList;
