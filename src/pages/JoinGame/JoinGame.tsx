import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Divider, IconButton, InputBase, Typography } from '@mui/material'
import {
  StyledStatusContainer,
  StyledConnectedText,
  StyledInputContainer,
  StyledFormHelperText,
  StyledLoadingButtonIcon,
  StyledConfirmButtonIcon
} from './JoinGame.styled';
import HttpsIcon from '@mui/icons-material/Https';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';
import SocketContext from 'context/SocketContext.ts';
import {
  MSG_CONNECT_TO_GAME_BY_CODES,
  MSG_ERROR,
} from "constants/SocketMessages.ts";
import { isGameCode } from 'helpers';
import SessionController from 'controllers/SessionController.tsx';
import { connectToGameByCodesMsg } from 'types/SocketMessages.ts';

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const JoinGame: React.FC = () => {
  const {gameCode: urlGameCode, userCode: urlUserCode}: UrlParams = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useContext(SocketContext);
  const [gameCode, setGameCode] = useState(urlGameCode || '')
  const [isConnecting, setIsConnecting] = useState(false)

  const isConnectionError = false;
  const connectionErrorMessage = null;
  const sendConnectionMessage = () => {
    setIsConnecting(true)
    socket.emit(
      MSG_CONNECT_TO_GAME_BY_CODES,
      {userCode: urlUserCode, gameCode, isJoiningGame: true} as connectToGameByCodesMsg
    );
  }

  useEffect(() => {
    socket.disconnect()
    socket.connect()

    const handleErrorMessage = () => {
      setIsConnecting(false)
      if (location.pathname.startsWith('/join/connecting')) {
        navigate(`/join`)
      }
    }

    socket.on(MSG_ERROR, handleErrorMessage);

    return () => {
      socket.off(MSG_ERROR, handleErrorMessage);
    };
  }, []);

  useEffect(() => {
    const gameCode = String(urlGameCode)
    if (isGameCode(gameCode)) {
      setGameCode(gameCode)
    }
  }, []);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendConnectionMessage()
  }

  return (
    <SessionController>
      <form onSubmit={handleSubmit}>
        <StyledPageContainer>
          <ImpLogo/>
          <Typography gutterBottom={true} variant="h2">Join game</Typography>
          <Typography gutterBottom={true} variant="subtitle2">
            <center>Type in password given by opponent:</center>
          </Typography>

          <StyledInputContainer $isError={isConnectionError}>
            <IconButton sx={{p: '10px'}}>
              <HttpsIcon/>
            </IconButton>
            <InputBase
              required
              sx={{ml: 1, flex: 1}}
              placeholder="GAME CODE"
              inputProps={{'aria-label': 'peer password', pattern: '^[a-zA-Z0-9]{6}$'}}
              onInput={event => setGameCode((event.target as HTMLInputElement).value)}
              value={gameCode}
              error={isConnectionError}
            />
            <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
            <IconButton type="submit" sx={{p: '10px'}} aria-label="submit" disabled={isConnecting}>
              {
                isConnecting
                  ? <StyledLoadingButtonIcon/>
                  : <StyledConfirmButtonIcon/>
              }
            </IconButton>
          </StyledInputContainer>

          <StyledFormHelperText error={true}>
            {connectionErrorMessage}
          </StyledFormHelperText>

          <StyledStatusContainer>
            {
              isConnecting
                ? <StyledConnectedText variant="h2">Connecting...</StyledConnectedText>
                : null
            }
          </StyledStatusContainer>
          <Button onClick={() => { navigate('/') }}>BACK TO MAIN PAGE</Button>
        </StyledPageContainer>
      </form>
    </SessionController>
  )
}

export default JoinGame
