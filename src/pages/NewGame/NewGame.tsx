import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Skeleton, Typography } from '@mui/material'

import SocketContext from 'context/SocketContext';

import { StyledCircularProgress, StyledCodeTypography, StyledPaper, StyledStatusContainer } from './NewGame.styled';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';
import { MSG_CONNECT_TO_GAME_BY_CODES } from 'constants/SocketMessages.ts';
import { isGameCode, isUserCode } from 'helpers';
import SessionContext from 'context/SessionContext.ts';
import { GameStatus } from 'constants/GameStatus.ts';
import ConnectionStatus from 'components/ConnectionStatus';
import CopyToClipboardButton from 'components/CopyToClipboardButton';

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const NewGame: React.FC = () => {
  const navigate = useNavigate();
  const {gameCode: urlGameCode, userCode: urlUserCode}: UrlParams = useParams()
  const socket = useContext(SocketContext);
  const {game} = useContext(SessionContext);
  const {status} = game;

  const [gameCode, setGameCode] = useState(urlGameCode || '');

  useEffect(() => {
    console.log('new game useEffect', isGameCode(urlGameCode), isUserCode(urlUserCode))
    // generate codes for new game
    if (isGameCode(urlGameCode) && isUserCode(urlUserCode)) {
      setGameCode(urlGameCode as string)
    } else {
      console.log('/new', 'useEffect', 'CONNECT_TO_GAME_BY_CODES')
      socket.emit(MSG_CONNECT_TO_GAME_BY_CODES, {
        userCode: undefined,
        gameCode: undefined
      });
    }
  }, [urlGameCode]);

  return (
    <StyledPageContainer>
      <ConnectionStatus />
      <ImpLogo/>
      <Typography gutterBottom={true} variant="h2">{status == GameStatus.SUSPENDED ? 'Waiting...' : 'New game'}</Typography>
      <Typography gutterBottom={true} variant="subtitle1">
        Ask opponent to join by this code:
      </Typography>
      <StyledPaper elevation={10}>
        <StyledCodeTypography variant="h2">
          {
            gameCode || <Skeleton animation="wave" variant="text"/>
          }
        </StyledCodeTypography>
      </StyledPaper>
      <StyledStatusContainer>
        <CopyToClipboardButton textToCopy={`${location.origin}/join/${gameCode}`} buttonText="Copy game link" />
        <StyledCircularProgress size={65} thickness={1} sx={{ mt:2 }}/>
        {/*<Typography gutterBottom={true} variant="subtitle2">*/}
        {/*  Enough waiting?*/}
        {/*</Typography>*/}
        {/*<Button variant="text">*/}
        {/*  Play solo*/}
        {/*</Button>*/}
      </StyledStatusContainer>

      <Button onClick={() => { navigate('/') }}>back to main page</Button>
    </StyledPageContainer>
  )
}

export default NewGame
