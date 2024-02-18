import styled from 'styled-components'
import Colors from 'constants/Colors.ts';

export {
  StyledContainer,
  StyledBox,
  StyledRow,
  StyledHeader,
  StyledAnswerContainer,
  StyledGuessNumber,
  StyledHeaderTypographyNumber,
  StyledHeaderTypographyText,
} from '../components.styled.tsx';

const StyledAnswerRowsContainer = styled.div`
  width: 138px;
`
const StyledHr = styled.hr`
  width: 95%;
  margin: 0;
  border: none;
  height: 1px;
  background-color: ${Colors.IMP_DARK_GREY}
`
const StyledResultBox = styled.div<{
  $isWin: boolean
}>`
  width: 100%; 
  height: 30px; 
  display: flex; 
  justify-content: space-evenly; 
  align-items: flex-start; 
  color: ${({$isWin}) => $isWin ? Colors.IMP_GREEN_WIN : Colors.IMP_RED_BAD};
  font-weight: 300 !important;
  margin-top: 5px;
`
export {
  StyledHr,
  StyledResultBox,
  StyledAnswerRowsContainer,
}
