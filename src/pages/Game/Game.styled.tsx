import styled from 'styled-components'

const StyledHeaderContainer = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const GuessBoxesContainer = styled.div`
  //background-color: red;
  width: 100%;

  flex-grow: 2;
  
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
`

// content
const StyledContentContainer = styled.div`
  //background-color: #2dc51d;
  flex-grow: 2;
  
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const StyledPickerProvider = styled.div`
  //background-color: lightpink;
  
  width: 100%;
  position: relative;
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  justify-content: space-between;
`

export {
  StyledHeaderContainer,
  GuessBoxesContainer,
  StyledPickerProvider,
  StyledContentContainer,
}
