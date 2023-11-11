import React from 'react';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import {
  StyledInfoBox,
  RichContentContainer,
  RichContentSection,
} from './InfoBox.styled.tsx';

type Props = {
  isGuessingTime: boolean
  isNumberPicked: boolean
  didOpponentPickedNumber: boolean
  isGameEnded: boolean
  playerWon: boolean
  opponentWon: boolean
}

const InfoBox: React.FC<Props> = (
  {
    isGuessingTime = false,
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
        return <>Game Over: <b>TIE!</b></>
      case isGameEnded && playerWon:
        return <>Game Over: <b>You won!</b></>
      case isGameEnded && opponentWon:
        return <>Game Over: <i>need to be faster next time!</i></>
      case isGameEnded:
        return <>Game Over: <i>not concluded...</i></>
      case isGuessingTime && !isNumberPicked:
        return 'Pick a number you want to guess'
      case isGuessingTime && !didOpponentPickedNumber:
        return 'Wait for you opponent to guess...'
      case isGuessingTime:
        return 'Both players picked numbers'
      case !isGuessingTime:
        return (
          <RichContentContainer>
            Description:
            <RichContentSection>
              <RadioButtonUncheckedOutlinedIcon fontSize="small" style={{ opacity: 0.6 }} />&nbsp;incorrect spot,
            </RichContentSection>
            <RichContentSection>
              <CheckCircleTwoToneIcon fontSize="small" style={{ opacity: 0.6 }} />&nbsp;right spot
            </RichContentSection>
          </RichContentContainer>
        )
      default:
        return 'Think about possible opponents number'
    }
  }


  return <StyledInfoBox elevation={1}>{getText()}</StyledInfoBox>
}

export default InfoBox
