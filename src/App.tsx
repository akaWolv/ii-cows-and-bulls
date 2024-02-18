import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import NewGame from './pages/NewGame';
import Prepare from './pages/Prepare';
import JoinGame from './pages/JoinGame';
import Game from './pages/Game';
import Error from './pages/Error';
import SessionController from 'controllers/SessionController.tsx';
import { ReactNode } from 'react';
import AppProvider from 'common/AppProvider';
import Admin from 'pages/Ii/Admin';

function App() {
  const controller = (children: ReactNode) => {
    return (
      <SessionController>
        {children}
      </SessionController>
    )
  }

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home/>} />
          <Route path={'/new'} element={controller(<NewGame/>)}>
            <Route path={'connecting/:gameCode/:userCode'} element={controller(<NewGame/>)} />
          </Route>
          <Route path={'/join'} element={controller(<JoinGame/>)}>
            <Route path={'connecting'}>
              <Route path={':gameCode'} element={controller(<JoinGame/>)}>
                <Route path={':userCode'} element={controller(<JoinGame/>)} />
              </Route>
            </Route>
            <Route path={':gameCode'} element={controller(<JoinGame/>)} />
          </Route>
          <Route path={'/pick-a-number/:gameCode/:userCode'} element={controller(<Prepare/>)} />
          <Route path={'/game/:gameCode/:userCode'} element={controller(<Game/>)} />
          <Route path={'/error/:code'} element={<Error />} />
          <Route path={'/ii/admin'} element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
