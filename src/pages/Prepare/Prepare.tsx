import React, { useContext, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form"

import { Button, Typography } from '@mui/material';
import { StyledPageContainer } from 'pages/pages.styled';
import { StyledButtonContainer, StyledRules, StyledPaper } from './Prepare.styled';

import ImpLogo from 'components/ImpLogo';
import NumberPicker from 'components/NumberPicker';
import { PICKER } from 'constants/Settings';
import { MSG_SET_NUMBER_FOR_USER_IN_GAME } from 'constants/SocketMessages.ts';
import SocketContext from 'context/SocketContext.ts';
import SessionContext from 'context/SessionContext.ts';
import { FormValues } from 'types/CommonTypes';
import Colors from 'constants/Colors.ts';
import CheckIcon from '@mui/icons-material/Check';
import { setNumberForUserInGameMsg } from 'types/SocketMessages.ts';
import { StyledContainer } from 'pages/Game/components/components.styled.tsx'
import ConnectionStatus from 'components/ConnectionStatus'

const Prepare: React.FC = () => {
  const socket = useContext(SocketContext);
  const session = useContext(SessionContext);

  const formMethods = useForm<FormValues>({
    defaultValues: {digitA: '', digitB: '', digitC: '', digitD: ''}
  })
  const {isValid} = formMethods.formState;

  const sendPickANumberMessage = (number: string) => {
    console.log(MSG_SET_NUMBER_FOR_USER_IN_GAME, {number});
    if (session.user?.code) {
      const msg: setNumberForUserInGameMsg = {number, userCode: session.user.code}
      socket.emit(MSG_SET_NUMBER_FOR_USER_IN_GAME, msg);
    } else {
      console.error("Invalid session.user.code")
    }
  }

  const onSubmit = (data: FormValues) => {
    const number = Object.values(data).join('')
    sendPickANumberMessage(number)
  }

  const registeredNumber = (() => {
    return session.user?.number || ''
  })()

  const isSameNumber = (() => {
    const { getValues } = formMethods
    return Object.values(getValues()).join('') == registeredNumber
  })()

  useEffect(() => {
    const { reset } = formMethods
    const [digitA, digitB, digitC, digitD] = registeredNumber.split('')
    console.log(formMethods.getValues())
    reset({digitA, digitB, digitC, digitD})
  }, [registeredNumber]);

  const renderButtonText = () => {
    if (registeredNumber) {
      return <>
        {isSameNumber && <CheckIcon sx={{color: Colors.IMP_GREEN_WIN}}/>}
        &nbsp;{!isSameNumber && 'You want change '} {registeredNumber}{!isSameNumber && '?'}
      </>
    } else {
      return 'Confirm'
    }
  }

  return (
    <StyledContainer>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <StyledPageContainer>
            <ConnectionStatus />
            <ImpLogo/>
            <Typography gutterBottom={true} variant="h2">Pick your number</Typography>

            <StyledPaper elevation={10}>
              <StyledRules gutterBottom={true} variant="subtitle2">
                <b><u>Rules</u></b> <br/>
                Pick 4 digits number. <br/>
                Number cannot start with 0. <br/>
                Digits cannot repeat.
              </StyledRules>
            </StyledPaper>

            <div style={{width: '85%'}}>
              <NumberPicker pickerSettings={PICKER}/>
            </div>

            <StyledButtonContainer>
              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                disabled={!isValid || isSameNumber}
              >
                {renderButtonText()}
              </Button>
            </StyledButtonContainer>
            {registeredNumber && 'Now wait for opponent to pick number...'}
          </StyledPageContainer>
        </form>
      </FormProvider>
    </StyledContainer>
  )
}

export default Prepare
