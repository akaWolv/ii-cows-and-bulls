import React, { ReactElement, ReactNode } from 'react'
import { ThemeProvider as MaterialThemeProvider } from '@mui/material'
import theme from 'helpers/materialTheme'

import { store } from 'stores/stopwatch'
import { Provider } from 'react-redux'

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <Provider store={store}>
      <MaterialThemeProvider theme={theme}>
        {children}
      </MaterialThemeProvider>
    </Provider>
  )
}

export default AppProvider
