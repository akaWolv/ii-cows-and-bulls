import React from 'react';

import { Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import {
  StyledAnswerContainer,
  StyledGuessNumber,
  StyledFunctionalRow,
} from './LoadingRow.styled.tsx';

type Props = {
  isGuessingTime?: boolean
  isNumberPicked?: boolean
}

const LoadingRow: React.FC<Props> = ({ isGuessingTime = false, isNumberPicked = false }) => {
  if (!isGuessingTime) {
    return null
  }

  const animation = isNumberPicked ? 'pulse' : false
  return (
    <StyledFunctionalRow>
      <StyledGuessNumber>
        {
          isNumberPicked
            ? <CheckIcon fontSize="small" sx={{ color: 'grey.500' }} />
            : <Skeleton animation="pulse" width={40} height={30} />
        }
      </StyledGuessNumber>
      <StyledAnswerContainer>
        <Skeleton animation={animation} variant="circular" width={16} height={16} sx={{ marginLeft: '2px'}} />
        <Skeleton animation={animation} variant="circular" width={16} height={16} sx={{ marginLeft: '4px'}} />
        <Skeleton animation={animation} variant="circular" width={16} height={16} sx={{ marginLeft: '4px'}} />
        <Skeleton animation={animation} variant="circular" width={16} height={16} sx={{ marginLeft: '4px'}} />
      </StyledAnswerContainer>
    </StyledFunctionalRow>

  )
}

export default LoadingRow
