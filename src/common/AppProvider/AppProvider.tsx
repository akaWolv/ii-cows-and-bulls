import { ReactElement, ReactNode } from 'react'
import { ThemeProvider as MaterialThemeProvider } from '@mui/material'
import theme from 'helpers/materialTheme'
import SocketContext, {socket} from 'context/SocketContext'
import Growler from 'components/Alert';

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <MaterialThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        {children}
        <Growler />
      </SocketContext.Provider>
    </MaterialThemeProvider>
  )
}

export default AppProvider
