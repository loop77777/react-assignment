import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Header from "./components/Header";
import Shifts from "./components/Shifts";
import AvailableShifts from "./components/AvailableShifts";

export const API_URL = "http://localhost:8080";

function App() {
  const [shifts, setShifts] = useState([]);

  // Fetch shifts
  const fetchShifts = async () => {
    const response = await fetch(`${API_URL}/shifts`);
    const data = await response.json();
    setShifts(data);
  };

  // Fetch shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/shifts" />} />
          <Route path="/shifts" element={<Shifts shifts={shifts} />} />
          <Route
            path="/available-shifts"
            element={<AvailableShifts shifts={shifts} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
