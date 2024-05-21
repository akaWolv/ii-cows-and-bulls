import { createTheme } from '@mui/material/styles'
import { colors } from '@mui/material'
import Colors from 'constants/Colors.ts'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4
    },
    h1: {
      fontSize: '3rem',
      fontWeight: 200
    },
    h2: {
      fontSize: '2.3rem',
      fontWeight: 200
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 200
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 200
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 200
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 200,
      lineHeight: 1.5
    },
    caption: {
      fontSize: '1em',
      fontWeight: 400,
      lineHeight: 1.3
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 850,
      lg: 950,
      xl: 1100
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      light: Colors.IMP_ORANGE,
      main: Colors.IMP_ORANGE,
      dark: Colors.IMP_ORANGE
    },
    secondary: {
      light: colors.pink[400],
      main: colors.pink[600],
      dark: colors.pink[800]
    },
    text: {
      primary: colors.grey[100],
      secondary: colors.grey[600]
    }
  },
  spacing: 8,
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          outlined: {
            boxShadow: 'none',
          },
          text: {
            boxShadow: 'none'
          }
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: Colors.IMP_ORANGE,
          padding: '10px',
          marginBottom: '10px',
        },
      },
    },
  }
})

export default theme
