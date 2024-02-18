import styled from 'styled-components'
import { Grid } from '@mui/material';
import Colors from 'constants/Colors.ts';

const StyledHeaderContainer = styled.div`
    width: 100%;
    height: 55px;
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
    flex-grow: 2;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`
const StyledPickerContainer = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const StyledGuessHeader = styled(Grid)`
    font-size: 0.8em;
    padding: 0 10px;
    margin-bottom: 5px;
    color: ${Colors.IMP_DIM_WHITE};
`
const StyledGuessHeaderLeft = styled(Grid)`
    text-align: left;
`
const StyledGuessHeaderRight = styled(Grid)`
    text-align: right;
`

export {
  StyledHeaderContainer,
  GuessBoxesContainer,
  StyledPickerContainer,
  StyledContentContainer,
  StyledGuessHeader,
  StyledGuessHeaderLeft,
  StyledGuessHeaderRight,
}
