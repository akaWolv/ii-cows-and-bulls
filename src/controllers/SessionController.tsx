import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

import {
  MSG_CONNECT_TO_GAME_BY_CODES,
  MSG_SESSION_GAME_DATA,
  MSG_SESSION_USER_DATA
} from 'constants/SocketMessages.ts';
import { GameStatus } from 'constants/GameStatus.ts';

import { GameCode, SessionData, SessionGameData, SessionUserData, UserCode } from 'types/CommonTypes.ts'

import SocketContext from 'context/SocketContext';
import SessionContext, { DEFAULT_SESSION_DATA } from 'context/SessionContext';
import { isGameCode, isUserCode } from 'helpers';
import { connectToGameByCodesMsg } from 'types/SocketMessages.ts';
import { LAST_GAME_CODE, LAST_USER_CODE } from 'constants/CookiesName.ts';


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
      MSG_CONNECT_TO_GAME_BY_CODES,
      {userCode: urlUserCode, gameCode: urlGameCode, isJoiningGame} as connectToGameByCodesMsg
    );
  }
  const handleSessionGameData = (sessionGameData: SessionGameData) => {
    const {code, status} = sessionGameData
    setSessionData({...sessionData, game: sessionGameData})
    setSessionGameData(sessionGameData)
    setGameCode(code)
    setGameStatus(status)

    new Cookies().set(LAST_GAME_CODE, code, {path: '/', maxAge: 24 * 3600})
  }
  const handleSessionUserData = (sessionUserData: SessionUserData) => {
    const {code} = sessionUserData
    setSessionData({...sessionData, user: sessionUserData})
    setSessionUserData(sessionUserData)
    setUserCode(code)

    new Cookies().set(LAST_USER_CODE, code, {path: '/', maxAge: 24 * 3600})
  }
  const rerouteOnGameStatus = () => {
    if (!gameCode || !gameStatus || !userCode) {
      return
    }

    switch (gameStatus) {
      case GameStatus.JOINING:
        if (location.pathname.startsWith('/new')) {
          navigate(`/new/connecting/${gameCode}/${userCode}`, { replace: true })
        } else {
          navigate(`/join/connecting/${gameCode}/${userCode}`, { replace: true })
        }
        break;
      case GameStatus.NOT_EXIST:
        navigate(`/error/404`)
        break;
      case GameStatus.PREPARE:
        navigate(`/pick-a-number/${gameCode}/${userCode}`)
        break;
      case GameStatus.PLAYING:
      case GameStatus.CONCLUDED:
        navigate(`/game/${gameCode}/${userCode}`)
        break;
      case GameStatus.SUSPENDED:
        if (location.pathname.startsWith('/pick-a-number')) {
          navigate(`/new/connecting/${gameCode}/${userCode}`)
        }
        break;
    }
  }
  const setPlayersConnection = () => {
    const {connectedHashList} = sessionGameData
    const {codeHash: playerCodeHash} = sessionUserData

    console.log('>>> checking player connection', connectedHashList, playerCodeHash)
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
  }, [gameCode, gameStatus, userCode])

  useEffect(() => {
    setPlayersConnection()
  }, [sessionGameData, sessionUserData])

  useEffect(() => {
    if (isGameCode(urlGameCode) && isUserCode(urlUserCode)) {
      sendConnectionMessage()
    }
  }, [urlGameCode, urlUserCode]);

  useEffect(() => {
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnection);
    socket.on(MSG_SESSION_GAME_DATA, handleSessionGameData);
    socket.on(MSG_SESSION_USER_DATA, handleSessionUserData);
    return () => {
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnection);
      socket.off(MSG_SESSION_GAME_DATA, handleSessionGameData);
      socket.off(MSG_SESSION_USER_DATA, handleSessionUserData);
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
