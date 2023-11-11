import React from 'react'
import { useFormContext } from 'react-hook-form';
import { StyledNumberPickerContainer } from './NumberPicker.styled';
import SinglePicker from 'components/NumberPicker/SinglePicker';
import { SettingsPicker } from 'constants/Settings.d';

type Props = {
  pickerSettings: SettingsPicker,
  disabled?: boolean
}

const NumberPicker: React.FC<Props> = ({ pickerSettings , disabled}) => {
  const {setFocus} = useFormContext();

  return (
    <StyledNumberPickerContainer $disabled={disabled}>
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
