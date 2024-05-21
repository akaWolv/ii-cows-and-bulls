import React from 'react';
import { StyledAlert } from './InfoBox.styled.tsx';
import { AlertColor } from '@mui/material/Alert/Alert'

type Props = {
  isGameActive: boolean
  isNumberPicked: boolean
  didOpponentPickedNumber: boolean
  isGameEnded: boolean
  playerWon: boolean
  opponentWon: boolean
  warning: string | boolean
}

const InfoBox: React.FC<Props> = (
  {
    isGameActive = false,
    isNumberPicked = false,
    didOpponentPickedNumber = false,
    isGameEnded = false,
    playerWon = false,
    opponentWon = false,
    warning = false
  }
) => {
  const getData = (): [AlertColor, string|React.JSX.Element] => {
    switch (true) {
      case Boolean(warning):
        return ['error', String(warning)]
      case isGameEnded && playerWon && opponentWon:
        return ['success', <>Game Over: <b>DRAW!</b></>]
      case isGameEnded && playerWon:
        return ['success', <>Game Over: <b>You won!</b></>]
      case isGameEnded && opponentWon:
        return ['warning', <>Game Over: <i>You need to be faster next time.</i></>]
      case isGameEnded:
        return ['warning', <>Game Over: <i>not resolved...</i></>]
      case isGameActive && !isNumberPicked && didOpponentPickedNumber:
        return ['info', 'Pick a number to guess... Opponent is waiting.']
      case isGameActive && !isNumberPicked:
        return ['info', 'Pick a number to guess']
      case isGameActive && !didOpponentPickedNumber:
        return ['success', 'Now wait for opponent to guess...']
      case isGameActive:
        return ['success', 'Both players picked numbers']
      case !isGameActive:
        return ['error', <>Game suspended - <b>all players not connected!</b></>]
      default:
        return ['info', 'Think about possible opponents number']
    }
  }

  const [severity, text] = getData()

  return <StyledAlert severity={severity}>{text}</StyledAlert>
}

export default InfoBox
