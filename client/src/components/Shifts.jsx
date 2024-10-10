import React, { useEffect } from "react";

// group shifts by date
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
  // fetch shifts on component mount
  useEffect(() => {
    groupShiftsByDate(shifts);
  }, [shifts]);

  return <div>booked shifts appear here</div>;
};

export default Shifts;
