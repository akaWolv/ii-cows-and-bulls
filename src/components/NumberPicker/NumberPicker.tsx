import React, { useState } from 'react'
import { Alert } from '@mui/material'
import { useFormContext } from 'react-hook-form';
import { StyledNumberPickerContainer } from './NumberPicker.styled';
import { SettingsPicker } from 'constants/Settings.d';
import { SinglePicker } from './SinglePicker';

type Props = {
  pickerSettings: SettingsPicker,
  disabled?: boolean,
  setExternalWarning?: ((text: string | boolean) => void)
}

const NumberPicker: React.FC<Props> = ({ pickerSettings, disabled, setExternalWarning }) => {
  const [warning, setWarning] = useState<string|boolean>(false)
  const { setFocus } = useFormContext();

  return (
    <>
      {
        !setExternalWarning && warning && <Alert variant="outlined" severity="error">{warning}</Alert>
      }
      <StyledNumberPickerContainer $disabled={disabled}>
        {
          pickerSettings.map(({ pattern, fieldName }, index) => {
            const jumpPreviousField = () => {
              pickerSettings[index - 1] && setFocus(pickerSettings[index - 1].fieldName)
            }
            const jumpNextField = () => {
              pickerSettings[index + 1] && setFocus(pickerSettings[index + 1].fieldName)
            }
            return <SinglePicker
              key={fieldName}
              fieldName={fieldName}
              pattern={pattern}
              jumpPreviousField={jumpPreviousField}
              jumpNextField={jumpNextField}
              setWarning={setExternalWarning || setWarning}
            />
          })
        }
      </StyledNumberPickerContainer>
    </>
  )
}

export default NumberPicker
