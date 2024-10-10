import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Shifts App
          </Typography>
          <Button
            color={location.pathname === "/shifts" ? "info" : "inherit"}
            component={Link}
            to="/shifts"
          >
            My shifts
          </Button>
          <Button
            color={location.pathname === "/available-shifts" ? "info" : "inherit"}
            component={Link}
            to="/available-shifts"
          >
            Available shifts
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
