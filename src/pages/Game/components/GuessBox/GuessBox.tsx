import React from 'react';

import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import LoadingRow from './components/LoadingRow';

import {
  StyledContainer,
  StyledBox,
  StyledRow,
  StyledHeader,
  StyledAnswerContainer,
  StyledGuessNumber,
  StyledHeaderTypographyNumber,
  StyledHeaderTypographyText,
  StyledHr,
  StyledResultBox,
  StyledAnswerRowsContainer
} from './GuessBox.styled.tsx';
import { Guess, UserGameNumber } from 'types/CommonTypes.ts';

type Props = {
  guessList: Guess[]
  isGameActive: boolean
  isNumberPicked: boolean
  isGameEnded: boolean
  isWin: boolean
  isTie: boolean
  header?: string
  variant?: 'player' | 'opponent'
  headerNumber?: UserGameNumber
  highlightedNumber?: UserGameNumber
}

const GuessBox: React.FC<Props> = (
  {
    guessList,
    header,
    isGameActive = false,
    isNumberPicked = false,
    isGameEnded = false,
    isWin = false,
    isTie = false,
    variant = 'player',
    headerNumber,
    highlightedNumber
  }
) => {
  let cColor = '#171717'
  let bColor = '#0a0a0a'
  if (variant === 'opponent') {
    cColor = '#171717'
    bColor = '#0a0a0a'
  }

  const getAnswerArray = (a: number) => Array.from(Array(a).keys())

  return (
    <StyledContainer>
      <StyledBox elevation={8} $background="secondary">
        <StyledHeader>
          {headerNumber && <StyledHeaderTypographyNumber>{headerNumber}</StyledHeaderTypographyNumber>}
          <StyledHeaderTypographyText variant="h6">{header}</StyledHeaderTypographyText>
        </StyledHeader>
        <StyledHr/>

        {
          isGameEnded && (
            <StyledResultBox $isWin={isWin}>
              {
                isWin
                  ? <><SentimentVerySatisfiedIcon/>{isTie ? 'It\'s a draw!' : variant == 'player' ? 'You won!' : 'Opponent won'}</>
                  : <><SentimentNeutralIcon/>{variant == 'player' ? 'You lost' : 'Opponent lost'}</>
              }
            </StyledResultBox>
          )
        }

        <LoadingRow isGuessingTime={isGameActive} isNumberPicked={isNumberPicked}/>
        <StyledAnswerRowsContainer>
          {
            Array.from(guessList).map(({number, bulls, cows}, id) => {
              const bAnswerList = getAnswerArray(bulls)
              const cAnswerList = getAnswerArray(cows)

              return (
                <StyledRow key={id}>
                  <StyledGuessNumber
                    $variant={variant === 'player' ? 'primary' : 'secondary'}
                    $isHighlighted={number === highlightedNumber}
                  >
                    {number}
                  </StyledGuessNumber>
                  <StyledAnswerContainer>
                    {bAnswerList.length + cAnswerList.length === 0 && <i>no hints...</i>}
                    {
                      bAnswerList.map((k) =>
                        <CheckCircleTwoToneIcon key={k} fontSize="small" sx={{color: bColor}}/>
                      )
                    }
                    {
                      cAnswerList.map((k) =>
                        <RadioButtonUncheckedOutlinedIcon key={k} fontSize="small" sx={{color: cColor}}/>
                      )
                    }
                  </StyledAnswerContainer>
                </StyledRow>
              )
            })
          }
        </StyledAnswerRowsContainer>
      </StyledBox>
    </StyledContainer>
  )
}

export default GuessBox
