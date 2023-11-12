import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material'
import { StyledButtonContainer } from './Error.styled';
import { StyledPageContainer } from 'pages/pages.styled';

import ImpLogo from 'components/ImpLogo';

type UrlParams = {
  code?: string
}

const Error: React.FC = () => {
  const navigate = useNavigate();
  const {code}: UrlParams = useParams()

  const getMessage = () => {
    return code == '404' ? '404: Not found...' : `Error: ${Number(code)}`
  }

  return (
    <StyledPageContainer $dense={true}>
      <ImpLogo />
      <Typography gutterBottom={true} variant="h3">{getMessage()}</Typography>
      <Typography gutterBottom={true} variant="subtitle2">
        Cows and Bulls by <a href={'http://indieimp.com'}>IndieImp.com</a>
      </Typography>
      <StyledButtonContainer>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            navigate(`/`)
          }}>
          back to start
        </Button>
      </StyledButtonContainer>
    </StyledPageContainer>
  )
}

export default Error
