import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  CONNECT_TO_GAME_BY_CODES,
  SESSION_GAME_DATA,
  GAME_STATUS_MSG_JOINING,
  GAME_STATUS_MSG_NOT_EXIST,
  GAME_STATUS_MSG_PLAYING,
  GAME_STATUS_MSG_PREPARE, SESSION_USER_DATA, GAME_STATUS_MSG_CONCLUDED, GAME_STATUS_MSG_SUSPENDED
} from 'constants/SocketMessages.ts';

import { GameCode, SessionData, SessionGameData, SessionUserData, UserCode } from 'types/CommonTypes.ts'

import SocketContext from 'context/SocketContext';
import SessionContext, { DEFAULT_SESSION_DATA } from 'context/SessionContext';
import { isGameCode, isUserCode } from 'helpers';
import { connectToGameByCodesMsg } from 'types/SocketMessages.ts';

type Props = {
  children: ReactNode
}

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const SessionController: React.FC<Props> = ({children}) => {
  const [isPlayerConnected, setIsPlayerConnected] = useState<boolean>(false)
  const [isOpponentConnected, setIsOpponentConnected] = useState<boolean>(false)

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
    const isJoiningGame = location.pathname.startsWith('/join')
    socket.emit(
      CONNECT_TO_GAME_BY_CODES,
      {userCode: urlUserCode, gameCode: urlGameCode, isJoiningGame} as connectToGameByCodesMsg
    );
  }
  const handleSessionGameData = (sessionGameData: SessionGameData) => {
    const {code, status} = sessionGameData
    setSessionData({...sessionData, game: sessionGameData})
    setSessionGameData(sessionGameData)
    setGameCode(code)
    setGameStatus(status)
  }
  const handleSessionUserData = (sessionUserData: SessionUserData) => {
    setSessionData({...sessionData, user: sessionUserData})
    setSessionUserData(sessionUserData)
    setUserCode(sessionUserData.code)
  }
  const rerouteOnGameStatus = () => {
    if (!gameCode || !gameStatus || !userCode) {
      return
    }
    switch (gameStatus) {
      case GAME_STATUS_MSG_JOINING:
        if (location.pathname == '/new' || location.pathname == '/join') {
          navigate(`${location.pathname}/connecting/${gameCode}/${userCode}`)
        } else {
          navigate(`/join/connecting/${gameCode}/${userCode}`)
        }
        break;
      case GAME_STATUS_MSG_NOT_EXIST:
        navigate(`/error/404`)
        break;
      case GAME_STATUS_MSG_PREPARE:
        navigate(`/pick-a-number/${gameCode}/${userCode}`)
        break;
      case GAME_STATUS_MSG_PLAYING:
      case GAME_STATUS_MSG_CONCLUDED:
      case GAME_STATUS_MSG_SUSPENDED:
        navigate(`/game/${gameCode}/${userCode}`)
        break;
    }
  }
  const checkPlayersConnection = () => {
    const {connectedHashList} = sessionGameData
    const {codeHash: playerCodeHash} = sessionUserData
    if (connectedHashList && playerCodeHash) {
      let isUserConnected = false
      let isOpponentConnected = false
      for (const connectedHash of connectedHashList) {
        if (connectedHash == playerCodeHash) {
          isUserConnected = true
        } else {
          isOpponentConnected = true
        }
      }
      setIsPlayerConnected(isUserConnected)
      setIsOpponentConnected(isOpponentConnected)
    }
  }
  const handleConnection = () => {
    console.log('connecting')
  }
  const handleDisconnection = () => {
    setIsPlayerConnected(false)
    setIsOpponentConnected(false)
  }

  useEffect(() => {
    rerouteOnGameStatus()
    checkPlayersConnection()
  }, [gameCode, gameStatus, userCode])

  useEffect(() => {
    if (isGameCode(urlGameCode) && isUserCode(urlUserCode)) {
      sendConnectionMessage()
    }
  }, [urlGameCode, urlUserCode]);

  useEffect(() => {
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnection);
    socket.on(SESSION_GAME_DATA, handleSessionGameData);
    socket.on(SESSION_USER_DATA, handleSessionUserData);
    return () => {
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnection);
      socket.off(SESSION_GAME_DATA, handleSessionGameData);
      socket.off(SESSION_USER_DATA, handleSessionUserData);
    };
  }, []);

  return (
    <SessionContext.Provider value={{
      game: sessionGameData,
      user: sessionUserData,
      isPlayerConnected,
      isOpponentConnected
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionController
