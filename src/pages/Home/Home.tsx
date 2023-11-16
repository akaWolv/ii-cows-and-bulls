import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material'
import { StyledButtonContainer } from './Home.styled';
import { StyledPageContainer } from 'pages/pages.styled';

import ImpLogo from 'components/ImpLogo';
import { useCookies } from 'react-cookie';
import { LAST_GAME_CODE, LAST_USER_CODE } from 'constants/CookiesName.ts';

const Home: React.FC = () => {
  const [{lastGameCode, lastUserCode}] = useCookies([LAST_GAME_CODE, LAST_USER_CODE]);
  const navigate = useNavigate();

  return (
    <StyledPageContainer $dense={true}>
      <ImpLogo/>
      <Typography gutterBottom={true} variant="h1">Cows and Bulls</Typography>
      <Typography gutterBottom={true} variant="subtitle2">
        by <a href={'http://indieimp.com'}>IndieImp.com</a>
      </Typography>
      <StyledButtonContainer>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            navigate(`/new`)
          }}>
          Start Game
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            navigate('/join')
          }}>
          Join Game
        </Button>
      </StyledButtonContainer>
      {
        lastUserCode && lastGameCode && (
          <StyledButtonContainer>
            <Button
              size="large"
              variant="outlined"
              onClick={() => {
                navigate(`/game/${lastGameCode}/${lastUserCode}`)
              }}>
              Join your last game
            </Button>
          </StyledButtonContainer>
        )
      }
    </StyledPageContainer>
  )
}

export default Home
