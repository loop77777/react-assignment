import React from "react";
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/shifts" />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/available-shifts" element={<AvailableShifts />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
