import React from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';

import {
  StyledButtonContainer,
  StyledButton,
  StyledPickerBlend,
} from './GameNumberPicker.styled.tsx';

import NumberPicker from 'components/NumberPicker';
import { PICKER } from 'constants/Settings';
import Colors from 'constants/Colors';

type Props = {
  isGuessingTime: boolean
  isPlayerPickedNumber: boolean
}

const GameNumberPicker: React.FC<Props> = (
  {
    isGuessingTime,
    isPlayerPickedNumber,
  }
) => {
  return (
    <>
      <NumberPicker pickerSettings={PICKER} disabled={!isGuessingTime || isPlayerPickedNumber } />
      <StyledButtonContainer>
        <StyledButton
          type="submit"
          size="small"
          variant="contained"
          disabled={!isGuessingTime || isPlayerPickedNumber }
        >
          {
            isPlayerPickedNumber
              ? <><CheckIcon sx={{color: Colors.IMP_GREEN_WIN}}/></>
              : <>Pick <NavigateNextIcon /></>
          }
        </StyledButton>
      </StyledButtonContainer>
      {!isGuessingTime && <StyledPickerBlend />}
    </>
  )
}

export default GameNumberPicker
