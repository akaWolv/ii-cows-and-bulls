import styled from 'styled-components'
import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import Colors from 'constants/Colors';

const StyledPaper = styled(Paper)`
  width: 250px;
  padding: 1em !important;
  padding-left: 2em !important;
  margin-bottom: 2em !important;
  color: ${Colors.IMP_DARK_GREY} !important;
  text-align: center;
  letter-spacing: 1em;
`

const StyledCircularProgress = styled(CircularProgress)`
  margin-bottom: 1.5em;
`

const StyledStatusContainer = styled.div`
  text-align: center;
  padding: 0;
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5em;
`

const StyledConnectedText = styled(Typography)`
  color: ${Colors.IMP_ORANGE};
`
const StyledCodeTypography = styled(Typography)`
  font-family: "Roboto Mono",Monospace,serif !important;
`
const StyledNewGameCodeButton = styled(Button)`
  color: ${Colors.IMP_ORANGE} !important;
`
const StyledInvalidCodeSpan = styled.span`
  color: ${Colors.IMP_RED_BAD};
`

export {
  StyledPaper,
  StyledCircularProgress,
  StyledStatusContainer,
  StyledConnectedText,
  StyledCodeTypography,
  StyledNewGameCodeButton,
  StyledInvalidCodeSpan,
}
