import React from 'react'
import { Button, Divider, IconButton, InputBase, Typography } from '@mui/material'
import {
  StyledStatusContainer,
  StyledConnectedText,
  StyledInputContainer,
  StyledFormHelperText,
  StyledLoadingButtonIcon,
  StyledConnectedButtonIcon,
  StyledConfirmButtonIcon,
} from './JoinGame.styled';
import HttpsIcon from '@mui/icons-material/Https';

import ImpLogo from 'components/ImpLogo';
import { StyledPageContainer } from 'pages/pages.styled';

const JoinGame: React.FC = () => {
  const isConnecting = false;
  const isConnected = false;
  const isConnectionError = false;
  const connectionErrorMessage = null;

  return (
    <StyledPageContainer>
      <ImpLogo />
      <Typography gutterBottom={true} variant="h2">Join game</Typography>
      <Typography gutterBottom={true} variant="subtitle2">
        <center>Type in password given by friend:</center>
      </Typography>

      <StyledInputContainer
        component="form"
        $isError={isConnectionError}
      >
        <IconButton sx={{p: '10px'}}>
          <HttpsIcon/>
        </IconButton>
        <InputBase
          sx={{ml: 1, flex: 1}}
          placeholder="Password"
          inputProps={{'aria-label': 'peer password'}}
          error={isConnectionError}
        />
        <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
        <IconButton sx={{p: '10px'}} aria-label="directions" disabled={isConnecting || isConnected}>
        {
          isConnecting
            ? <StyledLoadingButtonIcon />
            : isConnected
              ? <StyledConnectedButtonIcon />
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
                <Typography gutterBottom={true} variant="subtitle2">
                  Enough waiting?
                </Typography>
                <Button variant="text">
                  Play solo
                </Button>
              </>
            )
            : isConnected
              ? <StyledConnectedText variant="h2">Connected!</StyledConnectedText>
              : null
        }
      </StyledStatusContainer>
    </StyledPageContainer>
  )
}

export default JoinGame
