import styled from 'styled-components'

import { Paper } from '@mui/material';
import Colors from 'constants/Colors';

const StyledInfoBox = styled(Paper)`
  width: 95%;
  padding: 0.25em 0.5em !important;
  margin: 0 !important;
  background-color: ${Colors.IMP_ORANGE_DARK} !important;
  color: ${Colors.IMP_DIM_WHITE} !important;
  
  text-align: center;
  font-weight: 200;
`
const RichContentContainer = styled.div`
 display: flex; 
 justify-content: space-around; 
 align-items: center; 
`
const RichContentSection = styled.div`
 display: flex; 
 align-items: center; 
`

export {
  StyledInfoBox,
  RichContentContainer,
  RichContentSection,
}
