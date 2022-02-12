import React, { useState } from "react";
import { Box, Container, Button } from "@material-ui/core";
import AdminTabs from "./AdminTabs";
import logo from "./logo.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Add, Remove } from "@material-ui/icons";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

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
      <Box sx={{ mt: 1 }}>No Players at the Moment!</Box>
    </StyledGridOverlay>
  );
}

const AdminView = (props) => {
  const [selected, setSelected] = useState([]);
  const [court, setCourt] = React.useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 50, hidden: true },
    { field: "name", headerName: "Name", width: 100 },
    { field: "partnerName", headerName: "Partner", width: 100 },
    {
      field: "event",
      headerName: "Event",
      width: 100,
    },
    {
      field: "challenge",
      headerName: "Challenge?",
      width: 100,
    },
  ];

  const handleChange = (event) => {
    setCourt(event.target.value);
  };

  const handleDeletion = () => {
    const msg = { type: "action", action: "remove-selected", value: selected };
    props.wsSend(JSON.stringify(msg));
    setSelected([]);
  };

  const handleAddition = () => {
    const courts = {
      court1: 0,
      court2: 1,
      court3: 2,
      court4: 3,
      court5: 4,
      court6: 5,
    };

    if (court !== "") {
      const msg = {
        type: "action",
        action: "court-add",
        value: selected,
        court: courts[court],
      };
      props.wsSend(JSON.stringify(msg));
      setSelected([]);
    }
  };

  let rows = props.users.map((user) => ({
    id: user.uid,
    name: user.name,
    partnerName: user.partnerName,
    event: user.event,
    challenge: user.challenge,
  }));

  return (
    <Container maxWidth="sm">
      <h1>
        <center>Open Gym Queue</center>
      </h1>
      <Box
        display="flex"
        justifyContent="center"
        bottom={10}
        sx={{ p: 2, border: "1px grey" }}
      >
        <img src={logo} alt="Queue is empty" />
      </Box>
      <Box sx={{ p: 2, border: "0.25px dashed grey" }}>
        <h4>
          <strong>Instructions:</strong> <br></br> Administrators can select
          each person or pair and add them to a court. Please do not spam the
          button or you may unknowningly delete someone. On a mobile phone, the
          buttons may require you to hit them twice. On each court page you will
          be able to remove players from the court. Please message the officer
          chat if you have any issues. More features can be added later if I
          have time, just let me know what you want.
        </h4>
      </Box>
      <AdminTabs></AdminTabs>
      <Box display="flex" justifyContent="center">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            rows={rows}
            columns={columns}
            editabled={props.admin}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            onSelectionModelChange={(select) => setSelected(select)}
          />
        </div>
      </Box>
      <Box m={0.5} p={0.5}>
        <FormControl fullWidth>
          <InputLabel>Court</InputLabel>
          <Select value={court} label="Court" onChange={handleChange}>
            <MenuItem value={"court1"}>Court 1</MenuItem>
            <MenuItem value={"court2"}>Court 2</MenuItem>
            <MenuItem value={"court3"}>Court 3</MenuItem>
            <MenuItem value={"court4"}>Court 4</MenuItem>
            <MenuItem value={"court5"}>Court 5</MenuItem>
            <MenuItem value={"court6"}>Court 6</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Box p={1}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddition}
          >
            Add selected to court
          </Button>
        </Box>
        <Box p={1}>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<Remove />}
            onClick={handleDeletion}
          >
            Delete selected
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminView;
