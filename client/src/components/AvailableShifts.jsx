import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  List,
  ListItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../App";

const AvailableShifts = ({ shifts }) => {
  const theme = useTheme();
  // const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});
  const [updatedShifts, setUpdatedShifts] = useState(shifts);
  const [selectedCity, setSelectedCity] = useState("");

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

  const groupedShifts = groupShiftsByCityAndDate(updatedShifts);

  // Set initial selected city to the first city in the groupedShifts object
  useEffect(() => {
    if (!selectedCity && Object.keys(groupedShifts).length > 0) {
      setSelectedCity(Object.keys(groupedShifts)[0]);
    }
  }, [groupedShifts, selectedCity]);

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
    setButtonLoading((prev) => ({ ...prev, [shiftId]: true }));
    try {
      const shiftToBook = updatedShifts.find((shift) => shift.id === shiftId);
      if (shiftToBook.booked) {
        await axios.post(`${API_URL}/shifts/${shiftId}/cancel`);
        console.log("Shift cancelled");
      } else {
        await axios.post(`${API_URL}/shifts/${shiftId}/book`);
        console.log("Shift booked");
      }
      // Re-fetch shifts from the backend to get the updated state
      const response = await axios.get(`${API_URL}/shifts`);
      setUpdatedShifts(response.data);
    } catch (error) {
      console.error("Error booking/cancelling the shift:", error);
    }
    setButtonLoading((prev) => ({ ...prev, [shiftId]: false }));
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
        {
          // we can add a loading spinner here later if needed
          /* {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress color="inherit" />
          </Box> */
          selectedCity &&
            Object.entries(groupedShifts[selectedCity]).map(
              ([date, shifts]) => (
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
                        {formatTime(shift.startTime)} -{" "}
                        {formatTime(shift.endTime)}
                        {shift.booked && (
                          <span style={{ marginLeft: "auto" }}>Booked</span>
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
                          disabled={
                            isShiftOverlapping(
                              shift.startTime,
                              shift.endTime
                            ) || buttonLoading[shift.id]
                          }
                          variant="outlined"
                        >
                          {buttonLoading[shift.id] ? (
                            <CircularProgress size={24} />
                          ) : shift.booked ? (
                            "Cancel"
                          ) : (
                            "Book"
                          )}
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )
            )
        }
      </Box>
    </div>
  );
};

export default AvailableShifts;
