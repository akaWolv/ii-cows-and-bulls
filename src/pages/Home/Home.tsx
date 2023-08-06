import React from 'react'
import { Button, Typography } from '@mui/material'
import { StyledButtonContainer } from './Home.styled';
import { StyledPageContainer } from 'pages/pages.styled';

import ImpLogo from 'components/ImpLogo';

const Home: React.FC = () => {
  return (
    <StyledPageContainer $dense={true}>
      <ImpLogo />
      <Typography gutterBottom={true} variant="h1">Cows and Bulls</Typography>
      <Typography gutterBottom={true} variant="subtitle2">
        by <a href={'http://indieimp.com'}>IndieImp.com</a>
      </Typography>
      <StyledButtonContainer>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            window.location.href = `/new`
          }}>
          Start Game
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            window.location.href = `/join`
          }}>
          Join Game
        </Button>
      </StyledButtonContainer>
    </StyledPageContainer>
  )
}

export default Home
