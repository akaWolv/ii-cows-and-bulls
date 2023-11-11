// import { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import NewGame from './pages/NewGame';
import Prepare from './pages/Prepare';
import JoinGame from './pages/JoinGame';
import Game from './pages/Game';
import SessionController from 'controllers/SessionController.tsx';
import { ReactNode } from 'react';
import AppProvider from 'common/AppProvider';

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
          </Route>
          <Route path={'/pick-a-number/:gameCode/:userCode'} element={controller(<Prepare/>)} />
          <Route path={'/game/:gameCode/:userCode'} element={controller(<Game/>)} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
