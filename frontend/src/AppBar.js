import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "./logo.png";

const pages = [
  { name: "Website", url: "https://badminton.berkeley.edu/" },
  { name: "Slack", url: "https://cal-badminton.slack.com/signup" },
  { name: "Instagram", url: "https://www.instagram.com/cal_badminton/" },
  { name: "Facebook", url: "https://www.facebook.com/calbadminton1" },
  {
    name: "Facebook Group",
    url: "https://www.facebook.com/groups/calbadminton",
  },
];

function ResponsiveAppBar() {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton>
            <Avatar src={logo} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "opensans",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cal Badminton
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Typography
                variant="h8"
                noWrap
                component="a"
                href={page.url}
                target="_blank"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "opensans",
                  fontWeight: 500,
                  letterSpacing: ".2rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {page.name}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
