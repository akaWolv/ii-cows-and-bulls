import React from 'react'
import { useFormContext } from 'react-hook-form';
import { StyledNumberPickerContainer } from './NumberPicker.styled';
import SinglePicker from './SinglePicker';

type NumberPicker = [
  pickerSettings: { pattern: string, fieldName: string }[],
]

const NumberPicker: React.FC = ({ pickerSettings }: NumberPicker) => {
  const {setFocus} = useFormContext();

  return (
    <StyledNumberPickerContainer>
      {
        pickerSettings.map(({pattern, fieldName}, index) => {
          const jumpPreviousField = () => { pickerSettings[index - 1] && setFocus(pickerSettings[index - 1].fieldName) }
          const jumpNextField = () => { pickerSettings[index + 1] && setFocus(pickerSettings[index + 1].fieldName) }
          return <SinglePicker
            key={fieldName}
            fieldName={fieldName}
            pattern={pattern}
            jumpPreviousField={jumpPreviousField}
            jumpNextField={jumpNextField}
          />
        })
      }
    </StyledNumberPickerContainer>
  )
}

export default NumberPicker
