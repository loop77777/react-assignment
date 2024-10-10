import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    allVariants: {
      color: {
        light: "#CBD2E1",
        medium: "#A4B8D3",
        dark: "#4F6C92",
        heading: "#004FB4",
        alert: "#E2006A",
        success: "#16A64D",
      },
    },
  },
  palette: {
    primary: {
      main: "#F7F8FB",
    },
    background: {
      default: "#F1F4F8",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "50px",
          padding: "5px 20px",
          fontSize: "13px",
          fontWeight: "500",
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
