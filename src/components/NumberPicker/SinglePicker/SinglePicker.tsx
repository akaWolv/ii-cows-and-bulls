import React from 'react'
import { Controller, useFormContext } from "react-hook-form"

import { IconButton, TextField } from '@mui/material'
import { StyledDigitPickerContainer } from './SinglePicker.styled';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

interface SinglePicker {
  pattern: RegExp,
  fieldName: string,
  jumpPreviousField: () => void,
  jumpNextField: () => void
}

const SinglePicker: React.FC<SinglePicker> = ({pattern, fieldName, jumpPreviousField, jumpNextField}: SinglePicker) => {
  const {control, setValue, watch} = useFormContext();

  const increaseValue = () => {
    setValue(fieldName, String(_numberPicker(1)), {shouldValidate: true})
  }
  const decreaseValue = () => {
    setValue(fieldName, String(_numberPicker(-1)), {shouldValidate: true})
  }
  const onDirectChange = (value: string) => {
    const newFieldValue = value.match(pattern) ? value : ''
    let newValue = ''
    if (newFieldValue.length > 0) {
      const currentValue = _getCurrentFieldNumericValue()

      // reduce to one digit
      newValue = newFieldValue.length > 1 ? newFieldValue.replace(String(currentValue), '') : newFieldValue

      if (currentValue === Number(newValue)) {
        // same number do not change
        // if value is set jump to next
        newValue.length > 0 && jumpNextField()
        setValue(fieldName, newValue, {shouldValidate: true})
        return
      }

      const availableNumbers = _getAvailableNumbers()
      if (!availableNumbers.includes(Number(newValue))) {
        // number is not available
        setValue(fieldName, '', {shouldValidate: true})
        return
      }
    }
    // if value is set jump to next
    newValue.length > 0 && jumpNextField()
    setValue(fieldName, newValue, {shouldValidate: true})
    return
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Backspace' && (event.target as HTMLInputElement).value.length === 0) {
      jumpPreviousField()
    }
    if (event.code === 'ArrowLeft') {
      jumpPreviousField()
    }
    if (event.code === 'ArrowRight') {
      jumpNextField()
    }
  }

  const _numberPicker = (direction: -1 | 1) => {
    const value = _getCurrentFieldNumericValue()
    const availableNumbers = _getAvailableNumbers(value)
    const [sliceStart, sliceEnd]: [number?, number?] = direction > 0 ? [0, 1] : [-1, undefined]

    if (value === null) {
      // if not set, than set next available number
      return availableNumbers.slice(sliceStart, sliceEnd)
    }

    // value already set so we need to pick another available
    const currentIndex = value && availableNumbers.indexOf(value)
    return currentIndex + direction in availableNumbers
      ? availableNumbers[currentIndex + direction]
      : availableNumbers.slice(sliceStart, sliceEnd)
  }
  const _getCurrentFieldNumericValue = (): number | null => {
    const value = watch(fieldName)
    return value.length > 0 ? Number(String(value)) : null
  }
  const _getAvailableNumbers = (currentValue?: number | null): number[] => {
    const fields = watch()
    const takenNumbers = Object.values(fields).filter(i => i.length > 0).map((i) => Number(i)).filter(i => i !== currentValue)
    return [...Array(10).keys()].filter(n => !takenNumbers.includes(n) && String(n).match(pattern))
  }

  return (
    <StyledDigitPickerContainer>
      <IconButton aria-label="up" onClick={() => increaseValue()}>
        <KeyboardArrowUpRoundedIcon sx={{fontSize: '1.5em'}}/>
      </IconButton>
      <Controller
        name={fieldName}
        control={control}
        rules={{pattern, required: true}}
        render={({field: {ref, ...field}}) => (
          <TextField
            {...field}
            inputRef={ref}
            onChange={(e) => {
              onDirectChange(e.target.value)
              field.onChange(e)
            }}
            onKeyDown={onKeyDown}
            onBlur={() => {
              (document.activeElement as HTMLElement).blur()
            }}
            size="small"
            type="text"
            inputProps={{
              inputMode: 'numeric',
              style: {textAlign: 'center', fontSize: '2em'}
            }}
            style={{margin: '0.5em 0'}}
          />
        )}
      />
      <IconButton aria-label="down" onClick={() => decreaseValue()}>
        <KeyboardArrowDownRoundedIcon sx={{fontSize: '1.5em'}}/>
      </IconButton>
    </StyledDigitPickerContainer>
  )
}

export default SinglePicker
