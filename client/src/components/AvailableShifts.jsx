import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import { Button, List, ListItem, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../App";

const AvailableShifts = ({ shifts }) => {
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

  // Set initial selected city to the first city in the groupedShifts object
  const initialCity = Object.keys(groupedShifts)[0] || "";
  const [selectedCity, setSelectedCity] = useState(initialCity);

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

  // Check if the shift timing overlaps with the current time
  const isShiftOverlapping = (startTime, endTime) => {
    const now = new Date();
    return now >= new Date(startTime) && now >= new Date(endTime);
  };

  // Handle booking a shift
  const handleBookShift = async (shiftId) => {
    // Find the shift to book
    const shiftToBook = shifts.find((shift) => shift.id === shiftId);
    console.log(shiftToBook)
    // Check if the shift is already booked

    if (shiftToBook.booked) {
      // Cancel the booking
      try {
        await axios.post(`${API_URL}/shifts/${shiftId}/cancel`);
        // shiftToBook.booked = false;
        console.log("shift cancelled");
      } catch (error) {
        console.error("Error cancelling the shift:", error);
      }
    } else {
      // Book the shift
      try {
        await axios.post(`${API_URL}/shifts/${shiftId}/book`);
        // shiftToBook.booked = true;
        console.log("shift booked");
      } catch (error) {
        console.error("Error booking the shift:", error);
      }
    }
  };

  useEffect(() => {
    // Update selected city when shifts data changes
    if (Object.keys(groupedShifts).length > 0) {
      setSelectedCity(Object.keys(groupedShifts)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts]);

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
                    {shift.booked && (
                      <span style={{ marginRight: "10px" }}>Booked</span>
                    )}
                    <Button
                      onClick={() => handleBookShift(shift.id)}
                      sx={{
                        bgcolor: shift.booked
                          ? theme.typography.allVariants.color.alert
                          : theme.typography.allVariants.color.success,
                        ml: "auto",
                        border: 1,
                      }}
                      disabled={isShiftOverlapping(
                        shift.startTime,
                        shift.endTime
                      )}
                      variant="outlined"
                    >
                      {shift.booked ? "Cancel" : "Book"}
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
