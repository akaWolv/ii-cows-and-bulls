import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  CONNECT_TO_GAME_BY_CODES,
  SESSION_GAME_DATA,
  GAME_STATUS_MSG_CONNECTING,
  GAME_STATUS_MSG_NOT_EXIST,
  GAME_STATUS_MSG_PLAYING,
  GAME_STATUS_MSG_PREPARE, SESSION_USER_DATA
} from 'constants/SocketMessages.ts';

import { GameCode, SessionData, SessionGameData, SessionUserData, UserCode } from 'types/CommonTypes.ts'

import SocketContext from 'context/SocketContext';
import SessionContext, { DEFAULT_SESSION_DATA } from 'context/SessionContext';
import { isGameCode, isUserCode } from 'helpers';

type Props = {
  children: ReactNode
}

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const SessionController: React.FC<Props> = ({children}) => {
  const [gameCode, setGameCode] = useState<GameCode | undefined>(undefined)
  const [gameStatus, setGameStatus] = useState<string | undefined>(undefined)
  const [userCode, setUserCode] = useState<UserCode | undefined>(undefined)
  const {gameCode: urlGameCode, userCode: urlUserCode}: UrlParams = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(DEFAULT_SESSION_DATA as SessionData)
  const [sessionGameData, setSessionGameData] = useState({} as SessionGameData)
  const [sessionUserData, setSessionUserData] = useState({} as SessionUserData)

  const socket = useContext(SocketContext);

  const sendConnectionMessage = () => {
// console.log('AppController::CONNECT_TO_GAME_BY_CODES', {userCode: urlUserCode, gameCode: urlGameCode});
    socket.emit(CONNECT_TO_GAME_BY_CODES, {userCode: urlUserCode, gameCode: urlGameCode});
  }
  const handleSessionGameData = (sessionGameData: SessionGameData) => {
// console.log(SESSION_GAME_DATA, sessionGameData)
    const {code, status} = sessionGameData
    setSessionData({...sessionData, game: sessionGameData})
    setSessionGameData(sessionGameData)
    setGameCode(code)
    setGameStatus(status)
  }
  const handleSessionUserData = (sessionUserData: SessionUserData) => {
// console.log(SESSION_USER_DATA, sessionUserData)
    setSessionData({...sessionData, user: sessionUserData})
    setSessionUserData(sessionUserData)
    setUserCode(sessionUserData.code)
  }
  const handleGameStatus = () => {
// console.log('handleGameStatus', gameCode, gameStatus, userCode)
    if (!gameCode || !gameStatus || !userCode) {
      return
    }
    switch (gameStatus) {
      case GAME_STATUS_MSG_CONNECTING:
        if (location.pathname == '/new' || location.pathname == '/join') {
          navigate(`${location.pathname}/connecting/${gameCode}/${userCode}`)
        } else {
          // @todo: redirect 404?
        }
        break;
      case GAME_STATUS_MSG_NOT_EXIST:
        // navigate(`/pick-a-number/${gameCode}/${userCode}`)
        break;
      case GAME_STATUS_MSG_PREPARE:
        navigate(`/pick-a-number/${gameCode}/${userCode}`)
        break;
      case GAME_STATUS_MSG_PLAYING:
        navigate(`/game/${gameCode}/${userCode}`)
        break;
    }
  }

  useEffect(() => {
    handleGameStatus()
  }, [gameCode, gameStatus, userCode])

  useEffect(() => {
// console.log('G or U data changed:', urlGameCode, urlUserCode)
    if (isGameCode(urlGameCode) && isUserCode(urlUserCode)) {
      sendConnectionMessage()
    }
  }, [urlGameCode, urlUserCode]);

  useEffect(() => {
// console.log('SessionController Initialized')

    socket.on(SESSION_GAME_DATA, handleSessionGameData);
    socket.on(SESSION_USER_DATA, handleSessionUserData);
    return () => {
      socket.off(SESSION_GAME_DATA, handleSessionGameData);
      socket.off(SESSION_USER_DATA, handleSessionUserData);
    };
  }, []);

  return (
    <SessionContext.Provider value={{game: sessionGameData, user: sessionUserData}}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionController
