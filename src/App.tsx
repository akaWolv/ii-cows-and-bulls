import { ThemeProvider as MaterialThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from 'helpers/materialTheme';
import Home from './pages/Home';
import NewGame from './pages/NewGame';
import Prepare from './pages/Prepare';
import JoinGame from './pages/JoinGame';
import Game from './pages/Game';

function App() {
  return (
    <MaterialThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home/>}/>
          <Route path={'/new'} element={<NewGame />} />
          <Route path={'/join'} element={<JoinGame />} />
          <Route path={'/pick-a-number'} element={<Prepare />} />
          <Route path={'/game'} element={<Game />} />
        </Routes>
      </BrowserRouter>
    </MaterialThemeProvider>
  )
}

export default App
