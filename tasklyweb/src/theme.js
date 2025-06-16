import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052CC', // Trello'nun mavi rengi
      light: '#0065FF',
      dark: '#0747A6',
    },
    secondary: {
      main: '#00B8D9', // Trello'nun turkuaz rengi
      light: '#00C7E6',
      dark: '#008DA6',
    },
    background: {
      default: '#F4F5F7', // Trello'nun arka plan rengi
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172B4D', // Trello'nun koyu metin rengi
      secondary: '#5E6C84',
    },
    success: {
      main: '#36B37E', // Trello'nun yeşil rengi
      light: '#57D9A3',
      dark: '#00875A',
    },
    warning: {
      main: '#FFAB00', // Trello'nun sarı rengi
      light: '#FFE380',
      dark: '#FF8B00',
    },
    error: {
      main: '#FF5630', // Trello'nun kırmızı rengi
      light: '#FF8F73',
      dark: '#DE350B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 3,
          padding: '6px 12px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          boxShadow: '0 1px 1px rgba(9,30,66,0.25), 0 0 1px rgba(9,30,66,0.31)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(9,30,66,0.25), 0 0 1px rgba(9,30,66,0.31)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: 'none',
          borderRight: '1px solid rgba(9,30,66,0.08)',
        },
      },
    },
  },
});

export default theme; 