import React, { useContext, useEffect, useState } from 'react';

import { Typography } from '@mui/material';

import { useForm, FormProvider } from "react-hook-form"

import { StyledPageContainer } from 'pages/pages.styled';
import {
  StyledHeaderContainer,
  GuessBoxesContainer,
  StyledPickerContainer,
  StyledContentContainer, StyledGuessHeader, StyledGuessHeaderLeft, StyledGuessHeaderRight
} from './Game.styled';

import ImpLogo from 'components/ImpLogo';

import { GameMenu, GuessBox, GuessNumbers, Help, InfoBox } from './components';
import GameNumberPicker from './components/GameNumberPicker/GameNumberPicker.tsx';
import { FormValues, GameCode, Guess, UserCode, UserGameNumber } from 'types/CommonTypes.ts';
import SessionContext from 'context/SessionContext.ts';
import SocketContext from 'context/SocketContext.ts';
import { MSG_GUESS } from 'constants/SocketMessages.ts';
import { guessMsg } from 'types/SocketMessages.ts';
import { GameStatus } from 'constants/GameStatus.ts';

const Game: React.FC = () => {
  const { game, user, isPlayerConnected, isOpponentConnected } = useContext(SessionContext);
  const socket = useContext(SocketContext);

  const [gameCode, setGameCode] = useState<GameCode>('')
  const [userCode, setUserCode] = useState<UserCode>('')

  const [playerNumber, setPlayerNumber] = useState<UserGameNumber>('')

  const [playerNumberOfGuessesMade, setPlayerNumberOfGuessesMade] = useState<number>(0)
  const [opponentNumberOfGuessesMade, setOpponentNumberOfGuessesMade] = useState<number>(0)
  const [playerGuesses, setPlayerGuesses] = useState<Guess[]>([])
  const [pendingGuess, setPendingGuess] = useState<Guess|undefined>(undefined)
  const [opponentGuesses, setOpponentGuesses] = useState<Guess[]>([])

  const [isPlayerPickedNumber, setIsPlayerPickedNumber] = useState<boolean>(false)
  const [didOpponentPickedNumber, setDidOpponentPickedNumber] = useState<boolean>(false)

  const [isGameActive, setIsGameActive] = useState<boolean>(true)
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
  const [playerWon, setPlayerWon] = useState<boolean>(false)
  const [opponentWon, setOpponentWon] = useState<boolean>(false)

  const [warning, setWarning] = useState<string | boolean>(false)

  const formMethods = useForm<FormValues>({
    defaultValues: { digitA: '', digitB: '', digitC: '', digitD: '' }
  })
  const { getValues: formGetValues, reset: formReset } = formMethods

  useEffect(() => {
    if (Object.keys(game).length > 0 && Object.keys(user).length > 0) {
      console.log('GAME:game', game)
      console.log('GAME:user', user)

      const { number, codeHash, code: userCode } = user
      const {
        usersGuessList,
        winners,
        status,
        code: gameCode,
      } = game

      setPlayerNumber(number)
      setGameCode(gameCode)
      setUserCode(userCode)

      const { codeHash: yourCodeHash } = user
      for (const [userGuessListCodeHash, userGuessList] of Object.entries(usersGuessList)) {
        const { numberOfGuessesMade, visibleGuesses, pendingGuess } = userGuessList
        if (userGuessListCodeHash === yourCodeHash) {
          setPlayerNumberOfGuessesMade(numberOfGuessesMade)
          setPlayerGuesses(visibleGuesses)
          setPendingGuess(pendingGuess)
        } else {
          setOpponentNumberOfGuessesMade(numberOfGuessesMade)
          setOpponentGuesses(visibleGuesses)
        }
      }

      switch (status) {
        case GameStatus.CONCLUDED:
          setIsGameEnded(true)
          setIsGameActive(false)
          for (const winnerCodeHash of winners) {
            winnerCodeHash == codeHash ? setPlayerWon(true) : setOpponentWon(true)
          }
          break;
        case GameStatus.SUSPENDED:
          setIsGameActive(false)
          break;
        case GameStatus.PLAYING:
          setIsGameActive(true)
          break;
      }
    }
  }, [game, user])

  useEffect(() => {
    setIsPlayerPickedNumber(playerNumberOfGuessesMade > opponentNumberOfGuessesMade)
    setDidOpponentPickedNumber(playerNumberOfGuessesMade < opponentNumberOfGuessesMade)
  }, [playerNumberOfGuessesMade, opponentNumberOfGuessesMade])

  const sendGuess = (number: string) => {
    socket.emit(MSG_GUESS, { number, userCode } as guessMsg);
  }
  const onSubmit = (data: FormValues) => {
    const number = Object.values(data).join('')
    sendGuess(number)
    formReset()
  }
  const formNumber = (() => Object.values(formGetValues()).join(''))()
  const isFormNumberUsedBefore = (() => {
    console.log('isFormNumberUsedBefore', formNumber, playerGuesses)
    return playerGuesses.filter(({ number }) => number == formNumber).length > 0
  })()

  return (
    <StyledPageContainer>
      <StyledHeaderContainer>
        <ImpLogo size="sm" />
        <div style={{ flexGrow: '2' }}>
          <Typography variant="h2">Game</Typography>
        </div>
        <Help />
        <GameMenu
          gameCode={gameCode}
          userCode={userCode}
          isPlayerConnected={isPlayerConnected}
          isOpponentConnected={isOpponentConnected}
        />
      </StyledHeaderContainer>
      <StyledContentContainer>
        <StyledGuessHeader container style={{ textAlign: 'center' }}>
          <StyledGuessHeaderLeft item xs={6}><b>Your guesses</b></StyledGuessHeaderLeft>
          <StyledGuessHeaderRight item xs={6}>Opponents guesses</StyledGuessHeaderRight>
        </StyledGuessHeader>
        <GuessBoxesContainer>
          <GuessBox
            guessList={playerGuesses}
            isGameActive={isGameActive}
            isNumberPicked={isPlayerPickedNumber}
            variant="player"
            header=""
            isGameEnded={isGameEnded}
            isWin={playerWon}
            isTie={playerWon && opponentWon}
            highlightedNumber={isFormNumberUsedBefore ? formNumber : undefined}
            pendingGuess={pendingGuess}
          />
          <GuessNumbers
            guessListA={playerGuesses}
            guessListB={opponentGuesses}
            displayNextRow={isGameActive}
            displayEmptyRow={isGameEnded}
          />
          <GuessBox
            guessList={opponentGuesses}
            isGameActive={isGameActive}
            isNumberPicked={didOpponentPickedNumber}
            variant="opponent"
            header="Your number"
            headerNumber={playerNumber}
            isGameEnded={isGameEnded}
            isWin={opponentWon}
            isTie={playerWon && opponentWon}
          />
        </GuessBoxesContainer>

        <InfoBox
          isGameActive={isGameActive}
          isNumberPicked={isPlayerPickedNumber}
          didOpponentPickedNumber={didOpponentPickedNumber}
          isGameEnded={isGameEnded}
          playerWon={playerWon}
          opponentWon={opponentWon}
          warning={warning}
        />

        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <StyledPickerContainer>
              <GameNumberPicker
                isGuessingTime={isGameActive}
                isPlayerPickedNumber={isPlayerPickedNumber}
                isNumberUsedBefore={isFormNumberUsedBefore}
                setWarning={setWarning}
              />
            </StyledPickerContainer>
          </form>
        </FormProvider>
      </StyledContentContainer>
    </StyledPageContainer>
  )
}

export default Game
