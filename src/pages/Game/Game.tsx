import React from 'react';

import { Typography, IconButton } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import { useForm, FormProvider } from "react-hook-form"

import { StyledPageContainer } from 'pages/pages.styled';
import {
  StyledHeaderContainer,
  GuessBoxesContainer,
  StyledPickerProvider,
  StyledContentContainer,
} from './Game.styled';

import ImpLogo from 'components/ImpLogo';
import { GuessList } from 'types/Guess.ts';

import { GuessBox, GuessNumbers, InfoBox } from './components';
import GameNumberPicker from './components/GameNumberPicker/GameNumberPicker.tsx';

const yourGuesses: GuessList = [
  {id: 1, number: 1234, answer: {c: 1, b: 0}},
  {id: 2, number: 5678, answer: {c: 2, b: 0}},
  {id: 3, number: 5489, answer: {c: 0, b: 1}},
  {id: 4, number: 5489, answer: {c: 0, b: 0}},
  {id: 5, number: 5489, answer: {c: 0, b: 1}},
  {id: 6, number: 5489, answer: {c: 0, b: 1}},
  {id: 7, number: 5489, answer: {c: 0, b: 1}},
  {id: 8, number: 1234, answer: {c: 1, b: 3}}
]
const opponentGuesses: GuessList = [
  {id: 1, number: 1234, answer: {c: 1, b: 0}},
  {id: 2, number: 5678, answer: {c: 2, b: 0}},
  {id: 3, number: 1258, answer: {c: 0, b: 1}},
  {id: 4, number: 1258, answer: {c: 0, b: 1}},
  {id: 5, number: 1258, answer: {c: 0, b: 1}},
  {id: 6, number: 1258, answer: {c: 0, b: 1}},
  {id: 7, number: 2190, answer: {c: 2, b: 2}},
  {id: 8, number: 2910, answer: {c: 1, b: 3}}
]

const Game: React.FC = () => {
  const isGuessingTime = false
  const isPlayerPickedNumber = false
  const didOpponentPickedNumber = false
  const isGameEnded = false
  const playerWon = false
  const opponentWon = false

  const methods = useForm<FormValues>({
    defaultValues: {digitA: '', digitB: '', digitC: '', digitD: ''}
  })
  return (
    <StyledPageContainer>
      <StyledHeaderContainer>
        <ImpLogo size="sm"/>
        <div style={{flexGrow: '2'}}>
          <Typography variant="h2">Game</Typography>
        </div>
        <IconButton><HelpOutlineOutlinedIcon sx={{color: 'dimgrey'}}/></IconButton>
      </StyledHeaderContainer>
      <StyledContentContainer>

        <GuessBoxesContainer>
          <GuessBox
            guessList={yourGuesses}
            isGuessingTime={isGuessingTime}
            isNumberPicked={isPlayerPickedNumber}
            variant="player"
            header="Your guesses"
            isGameEnded={isGameEnded}
            isWin={playerWon}
          />
          <GuessNumbers
            guessListA={yourGuesses}
            guessListB={opponentGuesses}
            displayNextRow={isGuessingTime}
            displayEmptyRow={isGameEnded}
          />
          <GuessBox
            guessList={opponentGuesses}
            isGuessingTime={isGuessingTime}
            isNumberPicked={didOpponentPickedNumber}
            variant="opponent"
            header="Opponent"
            headerNumber={2468}
            isGameEnded={isGameEnded}
            isWin={opponentWon}
          />
        </GuessBoxesContainer>

        <InfoBox
            isGuessingTime={isGuessingTime}
            isNumberPicked={isPlayerPickedNumber}
            didOpponentPickedNumber={didOpponentPickedNumber}
            isGameEnded={isGameEnded}
            playerWon={playerWon}
            opponentWon={opponentWon}
        />

        <StyledPickerProvider>
          <FormProvider {...methods}>
            <GameNumberPicker
              isGuessingTime={isGuessingTime}
              isPlayerPickedNumber={isPlayerPickedNumber}
            />
          </FormProvider>
        </StyledPickerProvider>
      </StyledContentContainer>
    </StyledPageContainer>
  )
}

export default Game
