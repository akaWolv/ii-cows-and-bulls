import React from 'react';
import {
  StyledInfoBox
} from './InfoBox.styled.tsx';
import Colors from 'constants/Colors.ts';

type Props = {
  isGameActive: boolean
  isNumberPicked: boolean
  didOpponentPickedNumber: boolean
  isGameEnded: boolean
  playerWon: boolean
  opponentWon: boolean
}

const InfoBox: React.FC<Props> = (
  {
    isGameActive = false,
    isNumberPicked = false,
    didOpponentPickedNumber = false,
    isGameEnded = false,
    playerWon = false,
    opponentWon = false
  }
) => {
  const getText = () => {
    switch (true) {
      case isGameEnded && playerWon && opponentWon:
        return <>Game Over: <b>DRAW!</b></>
      case isGameEnded && playerWon:
        return <>Game Over: <b>You won!</b></>
      case isGameEnded && opponentWon:
        return <>Game Over: <i>need to be faster next time!</i></>
      case isGameEnded:
        return <>Game Over: <i>not concluded...</i></>
      case isGameActive && !isNumberPicked:
        return 'Pick a number you want to guess'
      case isGameActive && !didOpponentPickedNumber:
        return 'Wait for you opponent to guess...'
      case isGameActive:
        return 'Both players picked numbers'
      case !isGameActive:
        return <span style={{color: Colors.IMP_RED_BAD, fontWeight: 600}}>Game is suspended - connection error...</span>
      default:
        return 'Think about possible opponents number'
    }
  }


  return <StyledInfoBox elevation={1}>{getText()}</StyledInfoBox>
}

export default InfoBox
