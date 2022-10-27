import * as React from "react";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import { Box, Button, Container } from "@material-ui/core";
import CourtTabs from "./CourtTabs";
import AdminTabs from "./AdminTabs";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import PlayerInfo from "./PlayerInfo";
import { Add, Remove } from "@material-ui/icons";
import ResponseAppBar from "./AppBar";
import Typography from "@mui/material/Typography";

const sha512 = require("js-sha512");

// Add a hash here of the password + salt you want to gatekeep admin pages
const adminHash =
  "04003da001a9615a176b2ab11ca00e34d3fee0c37b75cd2adc9e448f74984f94958b7ba4bb0abae433c00d4f715e124ebec33911104ea4c2f1be143554a6ab69";

const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
  flexDirection: "column",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>
        <Typography>No Players at the Moment!</Typography>
      </Box>
    </StyledGridOverlay>
  );
}

export default function CourtData(props) {
  const [selected, setSelected] = useState([]);
  const [hash, setHash] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sortable: false,
      hide: !props.admin,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      sortable: false,
    },
    {
      field: "partnerName",
      headerName: "Partner",
      width: 150,
      sortable: false,
    },
    {
      field: "event",
      headerName: "Event",
      width: 100,
      sortable: false,
    },
  ];
  const courtNumber = {
    court1: 0,
    court2: 1,
    court3: 2,
    court4: 3,
    court5: 4,
    court6: 5,
  };
  const courtId = courtNumber[props.courtPath];

  useEffect(() => {
    let password;
    let hashVal;
    if (props.admin && hash !== adminHash) {
      do {
        password = prompt("Please enter the password to access this page!");
        if (password === null) {
          continue;
        }
        // Salt is added here for prod
        hashVal = sha512(password + "cal-badminton-is-awesome-69");
        setHash(hashVal);
      } while (password === null || hashVal !== adminHash);
    }
  }, [hash]);

  const handleDeletion = () => {
    const msg = {
      type: "action",
      action: "remove-selected",
      value: selected,
      court: courtId,
    };
    props.wsSend(JSON.stringify(msg));
    setSelected([]);
  };

  const playerInACourt = () => {
    var courts = props.courts;
    for (var i = 0; i < courts.length; i++) {
      for (var j = 0; j < courts[i].length; j++) {
        var user = courts[i][j];
        if (props.user.uid === user.uid) {
          return { court: i + 1, found: true };
        }
      }
    }
  };

  const handleJoinCourt = () => {
    var courtPlayerInfo = playerInACourt();
    if (courtPlayerInfo && courtPlayerInfo.found) {
      alert(
        `You cannot join the court becuase you are already on Court ${courtPlayerInfo.court}! Please leave Court ${courtPlayerInfo.court} to rejoin or join a new court!`
      );
      return;
    }
    const msg = {
      type: "action",
      action: "court-add",
      value: props.user,
      court: courtId,
    };
    props.wsSend(JSON.stringify(msg));
  };

  const handleLeaveCourt = () => {
    var courtPlayerInfo = playerInACourt();
    if (courtPlayerInfo === undefined) {
      alert(
        `You cannot leave Court ${
          courtId + 1
        } since you are not on the queue for it!`
      );
      return;
    }
    const msg = {
      type: "action",
      action: "court-remove",
      value: props.user,
      court: courtId,
    };
    props.wsSend(JSON.stringify(msg));
  };

  let rows;
  if (!Array.isArray(props.courts) || !props.courts.length) {
    rows = [];
  } else {
    rows = props.courts[courtId].map((user) => ({
      id: user.uid,
      name: user.name,
      partnerName: user.partnerName,
      event: user.event,
    }));
  }

  return (
    <Container>
      <ResponseAppBar></ResponseAppBar>
      <br></br>
      <br></br>
      <br></br>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" sx={{ p: 2 }}>
          <Typography
            variant="h4"
            noWrap
            component="a"
            align="center"
            sx={{
              mr: 2,
              fontWeight: 800,
              letterSpacing: "0rem",
              color: "inherit",
              textDecoration: "none",
              whiteSpace: "normal",
            }}
          >
            Open Gym Queue
          </Typography>
        </Box>
        {!props.admin && (
          <Box sx={{ p: 4, border: "0.25px dashed grey" }}>
            <Typography>
              <strong>Cal Badminton Open Gym Times:</strong> <br></br>
              Friday - 6:00 PM to 10:00 PM <br></br>
              Sunday - 10:00 AM to 1:00 PM
              <br></br>
              <br></br>
              <strong>Cal Badminton Practice Times:</strong> <br></br>
              Saturday - 2:00 PM to 5:00 PM
              <br></br>
              <br></br>
              Note that the times above are only for Cal Badminton members and
              are unrelated to open recreational badminton hosted by the RSF.
              Open gym and practice times may change or be cancelled, so be sure
              to check Slack for announcements!
              <br></br>
              <br></br>
              <strong>Instructions:</strong> <br></br>
              Click on the respective Court # below to join and leave the queue
              for that court. You will only be able to sign up on one court at a
              time. You must leave the current court to be able to sign up on
              another court.
              <br></br>
              <br></br>
              If you misspelled your name, your partner has changed, or you want
              to change events, then simply update it by following the same
              steps stated above and it will be reflected in the court queue.
              <br></br>
              <br></br>
              Feel free to queue for doubles even if you don't have a partner.
              We will try to find you one if you can't!
            </Typography>
          </Box>
        )}
        {props.admin && (
          <Box sx={{ p: 2, border: "0.25px dashed grey" }}>
            <Typography>
              <strong>Instructions:</strong> <br></br> In general, you shouldn't
              need to use this at all since the queue should run itself. Only
              use this functionality to nuke the queue for special reasons. For
              example, a good use case would be to delete an entry for someone
              whose partner is signed up for a court when they are already on
              another court's queue.
            </Typography>
          </Box>
        )}
        <br></br>
        {props.user && !props.admin && (
          <PlayerInfo
            user={props.user}
            defaultUser={props.defaultUser}
            updateUser={props.updateUser}
          ></PlayerInfo>
        )}
        {props.admin ? (
          <AdminTabs value={courtId}></AdminTabs>
        ) : (
          <CourtTabs value={courtId}></CourtTabs>
        )}
        {props.admin ? (
          <Box display="flex" justifyContent="center">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                components={{
                  NoRowsOverlay: CustomNoRowsOverlay,
                }}
                editMode="row"
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                onRowEditStop={(event) => console.log(event)}
                onSelectionModelChange={(select) => setSelected(select)}
              />
            </div>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                components={{
                  NoRowsOverlay: CustomNoRowsOverlay,
                }}
                editMode="row"
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                onSelectionModelChange={(select) => setSelected(select)}
                disableColumnFilter
                disableColumnSelector
              />
            </div>
          </Box>
        )}

        {props.admin ? (
          <center>
            <Box p={1}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleDeletion}
              >
                Remove selected players from Court {courtId + 1}
              </Button>
            </Box>
          </center>
        ) : (
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box p={1}>
              <Button
                onClick={handleJoinCourt}
                color="primary"
                variant="contained"
                startIcon={<Add />}
              >
                Join Court {courtId + 1} Queue
              </Button>
            </Box>
            <Box p={1}>
              <Button
                onClick={handleLeaveCourt}
                color="secondary"
                variant="contained"
                startIcon={<Remove />}
              >
                Leave Court {courtId + 1} Queue
              </Button>
            </Box>
          </Box>
        )}
        <br></br>
      </Container>
    </Container>
  );
}
