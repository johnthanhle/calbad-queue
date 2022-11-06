import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "./logo.png";

const sha512 = require("js-sha512");

const pages = [
  { name: "WEBSITE", url: "https://badminton.berkeley.edu/" },
  { name: "SLACK", url: "https://cal-badminton.slack.com/signup" },
  { name: "INSTAGRAM", url: "https://www.instagram.com/cal_badminton/" },
  { name: "FACEBOOK PAGE", url: "https://www.facebook.com/calbadminton1" },
  {
    name: "FACEBOOK GROUP",
    url: "https://www.facebook.com/groups/calbadminton",
  },
];

// Add a hash here of the password + salt you want to gatekeep admin pages
const adminHash = "";
function ResponsiveAppBar(props) {
  const handleAdminClick = () => {
    if (props.user && props.user.authenticated) {
      window.open("/admin", "_blank");
      return;
    }
    let password;
    let hashVal;
    password = prompt(
      "Please enter the password to authenticate yourself as admin!"
    );
    if (password === null) {
      alert("Password is invalid!");
      return;
    }
    // Salt is added here for prod
    hashVal = sha512(password);
    if (hashVal === adminHash) {
      props.user.authenticated = true;
      const msg = {
        type: "action",
        action: "update-user",
        value: props.user,
      };
      props.wsSend(JSON.stringify(msg));
      props.updateUser(props.user);
      alert("You have successfully authenticated!");
      window.open("/admin", "_blank");
    } else {
      alert("Password is incorrect, please try again!");
    }
  };
  return (
    <AppBar position="fixed" style={{ background: "#003262" }}>
      <Container maxWidth="xl">
        <Toolbar>
          <IconButton href="/">
            <Avatar src={logo} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontWeight: "bold",
              letterSpacing: "0rem",
              color: "inherit",
              textDecoration: "none",
              whiteSpace: "normal",
            }}
          >
            CAL BADMINTON
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            {pages.map((page) => (
              <Typography
                variant="h8"
                noWrap
                component="a"
                href={page.url}
                target="_blank"
                sx={{
                  mr: 2,
                  fontWeight: "bold",
                  letterSpacing: "0rem",
                  color: "inherit",
                  textDecoration: "none",
                  whiteSpace: "normal",
                }}
              >
                {page.name}
              </Typography>
            ))}
          </Box>
          <Button color="inherit" onClick={handleAdminClick}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              target="_blank"
              sx={{
                mr: 2,
                fontWeight: "bold",
                letterSpacing: "0rem",
                color: "inherit",
                textDecoration: "none",
                whiteSpace: "normal",
              }}
            >
              Admin
            </Typography>
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
