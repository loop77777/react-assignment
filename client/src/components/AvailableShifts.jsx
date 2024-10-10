import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import { Button, List, ListItem, Typography } from "@mui/material";

const AvailableShifts = ({ shifts }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const theme = useTheme();

  // Group shifts by city and date
  const groupShiftsByCityAndDate = (shifts) => {
    return shifts.reduce((acc, shift) => {
      const city = shift.area;
      const date = new Date(shift.startTime).toDateString();
      if (!acc[city]) {
        acc[city] = {};
      }
      if (!acc[city][date]) {
        acc[city][date] = [];
      }
      acc[city][date].push(shift);
      return acc;
    }, {});
  };

  const groupedShifts = groupShiftsByCityAndDate(shifts);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedCity(newValue);
  };

  // Format time to display only hours and minutes
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <Box
        sx={{ width: "100%", bgcolor: theme.typography.allVariants.color.dark }}
      >
        <Tabs
          value={selectedCity}
          onChange={handleTabChange}
          variant="fullWidth"
          centered
        >
          {Object.keys(groupedShifts).map((city) => (
            <Tab
              label={`${city} (${Object.keys(groupedShifts[city]).reduce(
                (acc, date) => acc + groupedShifts[city][date].length,
                0
              )})`}
              key={city}
              value={city}
              sx={{ color: theme.palette.primary.contrastText }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        {selectedCity &&
          Object.entries(groupedShifts[selectedCity]).map(([date, shifts]) => (
            <Box key={date}>
              <Typography
                sx={{
                  bgcolor: theme.typography.allVariants.color.medium,
                  fontWeight: "bold",
                }}
              >
                {date}
              </Typography>
              <List>
                {shifts.map((shift) => (
                  <ListItem
                    key={shift.id}
                    sx={{
                      bgcolor: theme.typography.allVariants.color.light,
                      mb: 1,
                    }}
                  >
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    <Button
                      sx={{
                        bgcolor: theme.typography.allVariants.color.success,
                        ml: "auto",
                      }}
                    >
                      Book
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
      </Box>
    </div>
  );
};

export default AvailableShifts;
