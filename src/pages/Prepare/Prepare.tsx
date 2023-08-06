import React from 'react';
import { useForm, FormProvider } from "react-hook-form"

import { Button, Typography } from '@mui/material';
import { StyledPageContainer } from 'pages/pages.styled';
import { StyledButtonContainer, StyledRules, StyledPaper } from './Prepare.styled';

import ImpLogo from 'components/ImpLogo';
import NumberPicker from 'components/NumberPicker';

const PICKERS_SETTINGS = [
  {pattern: '[1-9]', fieldName: 'digitA'},
  {pattern: '[0-9]', fieldName: 'digitB'},
  {pattern: '[0-9]', fieldName: 'digitC'},
  {pattern: '[0-9]', fieldName: 'digitD'}
]

type FormValues = {
  digitA: string,
  digitB: string,
  digitC: string,
  digitD: string,
};

const Prepare: React.FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {digitA: '', digitB: '', digitC: '', digitD: ''}
  })
  const { isValid } = methods.formState;

  const onSubmit = (data: FormValues) => console.log(data, Object.values(data).join(''));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StyledPageContainer>
          <ImpLogo/>
          <Typography gutterBottom={true} variant="h2">Pick a number</Typography>

          <StyledPaper elevation={10}>
            <StyledRules gutterBottom={true} variant="subtitle2">
              <b><u>Rules</u></b> <br/>
              Number cannot start with 0. <br/>
              Digits cannot repeat.
            </StyledRules>
          </StyledPaper>

          <NumberPicker pickerSettings={PICKERS_SETTINGS}/>

          <StyledButtonContainer>
            <Button
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              disabled={!isValid}
            >
              Confirm
            </Button>
          </StyledButtonContainer>
        </StyledPageContainer>
      </form>
    </FormProvider>
  )
}

export default Prepare
