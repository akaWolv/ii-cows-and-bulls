import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material'
import { StyledButtonContainer } from './Home.styled';
import { StyledPageContainer } from 'pages/pages.styled';

import ImpLogo from 'components/ImpLogo';
import { useCookies } from 'react-cookie';
import { LAST_GAME_CODE, LAST_USER_CODE } from 'constants/CookiesName.ts';
import SocketContext from 'context/SocketContext.ts'

const Home: React.FC = () => {
  const socket = useContext(SocketContext);
  const [{ lastGameCode, lastUserCode }] = useCookies([LAST_GAME_CODE, LAST_USER_CODE]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.disconnect()
    socket.connect()
  }, []);

  return (
    <StyledPageContainer $dense={true}>
      <ImpLogo />
      <div style={{textAlign: 'center'}}>
      <Typography variant="h1">Cows and Bulls</Typography>
      <Typography variant="subtitle2">
        by <a href={'http://indieimp.com'}>IndieImp.com</a>
      </Typography>
      </div>
      <StyledButtonContainer>
        <Button
          size="large"
          variant="outlined"
          fullWidth
          onClick={() => {
            navigate(`/new`)
          }}>
          NEW GAME
        </Button>
        <Button
          size="large"
          variant="outlined"
          fullWidth
          onClick={() => {
            navigate('/join')
          }}>
          JOIN GAME
        </Button>
        {
          lastUserCode && lastGameCode && (
            <Button
              size="large"
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(`/game/${lastGameCode}/${lastUserCode}`)
              }}>
              JOIN LAST GAME
            </Button>
          )
        }
      </StyledButtonContainer>
    </StyledPageContainer>
  )
}

export default Home
