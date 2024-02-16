import React from 'react';

import Colors from 'constants/Colors.ts';

import {
  StyledContainer,
  StyledBox,
  StyledRow,
  StyledHeader,
  StyledHeaderTypographyText,
  StyledFunctionalRow,
  StyledNumberRowIcon
} from './GuessOrderNumbers.styled.tsx';
import { Guess } from 'types/CommonTypes.ts';
import { Tooltip } from '@mui/material';

type Props = {
  guessListA: Guess[]
  guessListB: Guess[]
  displayNextRow: boolean
  displayEmptyRow: boolean
}

const GuessOrderNumbers: React.FC<Props> = (
  {
    guessListA,
    guessListB,
    displayNextRow = false,
    displayEmptyRow = false
  }
) => {
  const longestList = guessListA.length > guessListB.length ? guessListA.length : guessListB.length
  const iterator = Array.from(Array(longestList).keys())

  return (
    <StyledContainer>
      <StyledBox elevation={1} $background="primary" style={{backgroundColor: `${Colors.IMP_DARK_GREY} !important`}}>

        <StyledHeader>
          <StyledHeaderTypographyText variant="h6">
            <Tooltip title={'Round number'}>
              <StyledNumberRowIcon />
            </Tooltip>
          </StyledHeaderTypographyText>
        </StyledHeader>

        <hr style={{width: '95%', margin: 0, border: 'none', height: 1, backgroundColor: Colors.IMP_DARK_GREY}}/>

        { displayEmptyRow && <StyledFunctionalRow /> }

        {
          displayNextRow && (
            <StyledFunctionalRow style={{justifyContent: 'center', color: Colors.IMP_DIM_WHITE}}>
              {displayNextRow ? `${iterator.length + 1}.` : ''}
            </StyledFunctionalRow>
          )
        }

        {
          iterator.map((i) => (
            <StyledRow key={i} style={{justifyContent: 'center', color: Colors.IMP_DIM_WHITE}}>
              {iterator.length - i}.
            </StyledRow>
          ))
        }

      </StyledBox>
    </StyledContainer>
  )
}

export default GuessOrderNumbers
