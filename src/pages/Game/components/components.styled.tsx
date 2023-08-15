import styled from 'styled-components'
import { Paper, Typography } from '@mui/material';
import Colors from 'constants/Colors.ts';

const StyledContainer = styled.div`
  margin: 0;
  display: flex;
  padding: 0;
`
const StyledBox = styled(Paper)<{ $background: 'primary' | 'secondary' }>`
  padding: 0.2em 0.5em !important;
  margin: 0;
  background-color: ${({$background}) => $background === 'primary' ? Colors.IMP_DARK_GREY : Colors.IMP_LIGHT_GREY } !important;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-start;
`
const StyledRow = styled.div`
  //background-color: lawngreen;
  //border: solid 1px lawngreen;
  
  width: 100%;
  height: 30px;
  padding: 0.25em !important;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  font-weight: 200;
`
const StyledHeader = styled.div`
  width: 100%; 
  height: 24px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  color: ${Colors.IMP_ORANGE};
`
const StyledHeaderTypographyNumber = styled.div`
  color: ${Colors.IMP_DIM_WHITE};
  font-size: 1.1em;

  padding-right: 0.25em;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-weight: 300;
  font-family: "Roboto Mono",Monospace,serif;
`
const StyledHeaderTypographyText = styled(Typography)`
  width: 60%;
  text-align: center;
  color: ${Colors.IMP_DIM_WHITE};
`
const StyledAnswerContainer = styled.div`
  //background-color: yellow;
  
  width: 60%;
    
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  
  color: ${Colors.IMP_DARK_GREY};
  font-weight: 300;
`
const StyledGuessNumber = styled.div<{ $variant?: 'primary' | 'secondary' }>`
  //background-color: red;
  flex-grow: 2;
  font-size: 1.1em;
  
  padding-right: 0.25em;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-weight: ${({$variant}) => $variant === 'primary' ? 400 : 200 } !important;
  font-family: "Roboto Mono",Monospace,serif;
  color: ${({$variant}) => $variant === 'primary' ? Colors.IMP_ORANGE : Colors.IMP_DIM_WHITE }
`
const StyledFunctionalRow = styled.div`
  //background-color: lawngreen;
  //border: solid 1px lawngreen;
  
  width: 100%;
  height: 30px;
  padding: 0.25em !important;
  padding-top: 0 !important;

  display: flex;
  flex-direction: row;
  align-items: center;
`
export {
  StyledContainer,
  StyledBox,
  StyledRow,
  StyledHeader,
  StyledAnswerContainer,
  StyledGuessNumber,
  StyledHeaderTypographyNumber,
  StyledHeaderTypographyText,
  StyledFunctionalRow,
}
