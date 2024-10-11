import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
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

// Group shifts by date
export const groupShiftsByDate = (shifts) => {
  return shifts.reduce((acc, shift) => {
    const date = new Date(shift.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {});
};

const Shifts = ({ shifts }) => {
  const theme = useTheme();
  const [buttonLoading, setButtonLoading] = useState({});
  const [bookedShifts, setBookedShifts] = useState([]);

  useEffect(() => {
    // Filter booked shifts
    const filteredShifts = shifts.filter((shift) => shift.booked);
    setBookedShifts(filteredShifts);
  }, [shifts]);

  const groupedShifts = groupShiftsByDate(bookedShifts);

  // Format time to display only hours and minutes
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle canceling a shift
  const handleCancelShift = async (shiftId) => {
    setButtonLoading((prev) => ({ ...prev, [shiftId]: true }));
    try {
      await axios.post(`${API_URL}/shifts/${shiftId}/cancel`);
      // Re-fetch shifts from the backend to get the updated state
      const response = await axios.get(`${API_URL}/shifts`);
      const filteredShifts = response.data.filter((shift) => shift.booked);
      setBookedShifts(filteredShifts);
      console.log("Shift cancelled");
    } catch (error) {
      console.error("Error cancelling the shift:", error);
    }
    setButtonLoading((prev) => ({ ...prev, [shiftId]: false }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      {Object.entries(groupedShifts).map(([date, shifts]) => (
        <Box key={date}>
          <Typography
            sx={{
              bgcolor: theme.typography.allVariants.color.medium,
              fontWeight: "bold",
            }}
          >
            {date} ({shifts.length} shifts)
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
                <Typography mr={3}>{shift.area} -</Typography>
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                <span style={{ marginLeft: "auto" }}>Booked</span>
                <Button
                  onClick={() => handleCancelShift(shift.id)}
                  sx={{
                    bgcolor: theme.typography.allVariants.color.alert,
                    ml: "auto",
                    border: 1,
                  }}
                  variant="outlined"
                  disabled={buttonLoading[shift.id]}
                >
                  {buttonLoading[shift.id] ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Shifts;
