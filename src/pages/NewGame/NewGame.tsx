import React from 'react'
import { Button, Typography } from '@mui/material'
import {
  StyledPaper,
  StyledCircularProgress,
  StyledStatusContainer,
  StyledConnectedText
} from './NewGame.styled';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';

const NewGame: React.FC = () => {
  const isConnecting = true;
  const isConnected = false;

  return (
    <StyledPageContainer>
      <ImpLogo />
      <Typography gutterBottom={true} variant="h2">New game</Typography>
      <Typography gutterBottom={true} variant="subtitle1">
        Password:
      </Typography>
      <StyledPaper elevation={10}>
        <Typography variant="h2">XYZ567</Typography>
      </StyledPaper>
      <Typography gutterBottom={true} variant="subtitle2">
        Pass it to you Opponent and wait...
      </Typography>
      <StyledStatusContainer>
        {
          isConnecting
            ? (
              <>
                <StyledCircularProgress size={65} thickness={1}/>
                <Typography gutterBottom={true} variant="subtitle2">
                  Enough waiting?
                </Typography>
                <Button variant="text">
                  Play solo
                </Button>
              </>
            )
            : isConnected
              ? (
                <>
                  <StyledConnectedText variant="h2">Connected!</StyledConnectedText>
                </>
              )
              : null
        }
      </StyledStatusContainer>
    </StyledPageContainer>
  )
}

export default NewGame
