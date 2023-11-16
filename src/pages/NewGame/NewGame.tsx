import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Skeleton, Typography } from '@mui/material'

import SocketContext from 'context/SocketContext';

import {
  StyledPaper,
  StyledCircularProgress,
  StyledStatusContainer,
  StyledCodeTypography,
} from './NewGame.styled';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';
import {
  MSG_CONNECT_TO_GAME_BY_CODES
} from 'constants/SocketMessages.ts';
import { isGameCode, isUserCode } from 'helpers';

type UrlParams = {
  gameCode?: string
  userCode?: string
}

const NewGame: React.FC = () => {
  const navigate = useNavigate();
  const {gameCode: urlGameCode, userCode: urlUserCode}: UrlParams = useParams()
  const socket = useContext(SocketContext);

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
      <ImpLogo/>
      <Typography gutterBottom={true} variant="h2">New game</Typography>
      <Typography gutterBottom={true} variant="subtitle1">
        Game Code:
      </Typography>
      <StyledPaper elevation={10}>
        <StyledCodeTypography variant="h2">
          {
            gameCode || <Skeleton animation="wave" variant="text"/>
          }
        </StyledCodeTypography>
      </StyledPaper>
      <StyledStatusContainer>
        <Typography gutterBottom={true} variant="subtitle2">
          Ask opponent to join your game <br />by providing the code above
        </Typography>
        <StyledCircularProgress size={65} thickness={1}/>
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
