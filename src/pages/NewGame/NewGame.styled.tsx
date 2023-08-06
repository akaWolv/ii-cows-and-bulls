import styled from 'styled-components'
import { CircularProgress, Paper, Typography } from '@mui/material';
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

export {
  StyledPaper,
  StyledCircularProgress,
  StyledStatusContainer,
  StyledConnectedText
}
