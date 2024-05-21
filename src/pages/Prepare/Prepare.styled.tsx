import styled from 'styled-components'
import { Paper, Typography } from '@mui/material';
import Colors from 'constants/Colors';

const StyledButtonContainer = styled.div`
  width: 85%;
  height: 55px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
`

const StyledPaper = styled(Paper)`
  width: 80%;
  padding: 0.5em !important;
  color: ${Colors.IMP_DARK_GREY} !important;
  text-align: center;
`

const StyledRules = styled(Typography)`
  text-align: center;
`

export {
  StyledButtonContainer,
  StyledRules,
  StyledPaper,
}
