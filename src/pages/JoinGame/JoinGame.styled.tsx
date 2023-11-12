import styled, { keyframes } from 'styled-components'
import { Paper, FormHelperText, Typography } from '@mui/material';
import Colors from 'constants/Colors';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import EastIcon from '@mui/icons-material/East';

const StyledStatusContainer = styled.div`
  padding: 1em;
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const StyledConnectedText = styled(Typography)`
  color: ${Colors.IMP_ORANGE};
`

// input
const StyledInputContainer = styled(Paper)<{
  $isError: boolean
}>`
  margin: 1em;
  padding: 2px 4px !important; 
  display: flex;
  align-items: center;
  width: 80%;
  border-bottom: solid 4px transparent;
  ${({ $isError }) => $isError && `
    border-bottom: solid 4px ${Colors.IMP_RED_BAD};
  `};
`

const StyledFormHelperText = styled(FormHelperText)`
  font-size: 0.9em; 
  height: 25px;
`

const spinAnimation = keyframes`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
`
const StyledLoadingButtonIcon = styled(RotateRightIcon)`
  color: white;
  animation: ${spinAnimation} 600ms infinite linear;
`

const StyledConfirmButtonIcon = styled(EastIcon)`
`

export {
  StyledStatusContainer,
  StyledConnectedText,
  StyledFormHelperText,
  StyledInputContainer,
  StyledLoadingButtonIcon,
  StyledConfirmButtonIcon,
}
