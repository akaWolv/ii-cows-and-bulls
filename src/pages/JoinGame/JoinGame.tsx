import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, IconButton, InputBase, Typography } from '@mui/material'
import {
  StyledStatusContainer,
  StyledConnectedText,
  StyledInputContainer,
  StyledFormHelperText,
  StyledLoadingButtonIcon,
  StyledConnectedButtonIcon,
  StyledConfirmButtonIcon
} from './JoinGame.styled';
import HttpsIcon from '@mui/icons-material/Https';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';
import SocketContext from 'context/SocketContext.ts';
import {
  CONNECT_TO_GAME_BY_CODES,
  ERROR_MESSAGE,
  CONNECTED_TO_GAME
} from "constants/SocketMessages.ts";
import { isGameCode, isUserCode } from 'helpers';
import SessionController from 'controllers/SessionController.tsx';

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const JoinGame: React.FC = () => {
  const {gameCode: urlGameCode, userCode: urlUserCode}: UrlParams = useParams()
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [gameCode, setGameCode] = useState(urlGameCode || '')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const isConnectionError = false;
  const connectionErrorMessage = null;
  const sendConnectionMessage = () => {
    setIsConnecting(true)
    socket.emit(CONNECT_TO_GAME_BY_CODES, {userCode: urlUserCode, gameCode});
  }

  useEffect(() => {
    const handleConnectedToGame = ({gameCode, userCode}: { gameCode: string, userCode: string }) => {
      if (isGameCode(gameCode) && isUserCode(userCode)) {
        setIsConnected(true)
        navigate(`/join/${gameCode}/${userCode}`)
      }
    }

    const handleErrorMessage = () => {
      setIsConnecting(false)
    }

    socket.on(CONNECTED_TO_GAME, handleConnectedToGame);
    socket.on(ERROR_MESSAGE, handleErrorMessage);

    return () => {
      socket.off(CONNECTED_TO_GAME, handleConnectedToGame);
      socket.off(ERROR_MESSAGE, handleErrorMessage);
    };
  }, []);

  useEffect(() => {
    const gameCode = String(urlGameCode)
    if (isGameCode(gameCode)) {
      setGameCode(gameCode)
      sendConnectionMessage()
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
            <center>Type in password given by friend:</center>
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
            <IconButton type="submit" sx={{p: '10px'}} aria-label="submit" disabled={isConnecting || isConnected}>
              {
                isConnecting
                  ? <StyledLoadingButtonIcon/>
                  : isConnected
                    ? <StyledConnectedButtonIcon/>
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
                ? (
                  <>
                    {/*<Typography gutterBottom={true} variant="subtitle2">*/}
                    {/*  Enough waiting?*/}
                    {/*</Typography>*/}
                    {/*<Button variant="text">*/}
                    {/*  Play solo*/}
                    {/*</Button>*/}
                  </>
                )
                : isConnected
                  ? <StyledConnectedText variant="h2">Connected!</StyledConnectedText>
                  : null
            }
          </StyledStatusContainer>
        </StyledPageContainer>
      </form>
    </SessionController>
  )
}

export default JoinGame
