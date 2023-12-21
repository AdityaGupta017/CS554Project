// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0', // blue - for accent elements (10%)
    },
    secondary: {
      main: '#424242', // darker grey - for headers, footers, text (30%)
    },
    background: {
      default: '#eeeeee', // light grey - for the main background (60%)
      paper: '#ffffff', // white - for card backgrounds, etc.
    },
    text: {
      primary: '#333333', // very dark grey - for primary text
      secondary: '#1565c0', // blue - for secondary text or elements you want to highlight
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // white text for contrast on buttons
        },
      },
    },
    // ... you can override other components here as needed
  },
});

export default theme;
