import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

import {
  StyledButtonContainer,
  StyledButton,
  StyledPickerBlend,
} from './GameNumberPicker.styled.tsx';

import NumberPicker from 'components/NumberPicker';
import { PICKER } from 'constants/Settings';
import Colors from 'constants/Colors';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

type Props = {
  isGuessingTime: boolean
  isPlayerPickedNumber: boolean
  isNumberUsedBefore: boolean
}

const GameNumberPicker: React.FC<Props> = (
  {
    isGuessingTime,
    isPlayerPickedNumber,
    isNumberUsedBefore,
  }
) => {
  const renderButtonContent = () => {
    if (isPlayerPickedNumber) {
      return <CheckIcon sx={{color: Colors.IMP_GREEN_WIN}} />
    } else if (isNumberUsedBefore) {
      return <>Used&nbsp;<NotInterestedIcon fontSize='small' /></>
    } else {
      return <>Pick</>
    }
  }

  return (
    <>
      <NumberPicker pickerSettings={PICKER} disabled={!isGuessingTime || isPlayerPickedNumber } />
      <StyledButtonContainer>
        <StyledButton
          type="submit"
          size="small"
          variant="contained"
          disabled={!isGuessingTime || isPlayerPickedNumber || isNumberUsedBefore }
        >
          {renderButtonContent()}
        </StyledButton>
      </StyledButtonContainer>
      {!isGuessingTime && <StyledPickerBlend />}
    </>
  )
}

export default GameNumberPicker
