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
import { Guess } from 'types/CommonTypes.ts';

type Props = {
  header: string
  guessList: Guess[]
  isGuessingTime: boolean
  isNumberPicked: boolean
  isGameEnded: boolean
  isWin: boolean
  variant?: 'player' | 'opponent'
  headerNumber?: number
}

const GuessBox: React.FC<Props> = (
  {
    guessList,
    header,
    isGuessingTime = false,
    isNumberPicked = false,
    isGameEnded = false,
    isWin = false,
    variant = 'player',
    headerNumber
  }
) => {
  let cColor = '#171717'
  let bColor = '#0a0a0a'
  if (variant === 'opponent') {
    // cColor = '#444444'
    // bColor = '#575757'
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
                  ? <><SentimentVerySatisfiedIcon/><b>Good job!</b></>
                  : <><SentimentNeutralIcon/>Try harder</>
              }
            </StyledResultBox>
          )
        }

        <LoadingRow isGuessingTime={isGuessingTime} isNumberPicked={isNumberPicked}/>
        <StyledAnswerRowsContainer>
          {
            Array.from(guessList).reverse().map(({number, bulls, cows}, id) => {
              const bAnswerList = getAnswerArray(bulls)
              const cAnswerList = getAnswerArray(cows)

              return (
                <StyledRow key={id}>
                  <StyledGuessNumber $variant={variant === 'player' ? 'primary' : 'secondary'}>
                    {number}
                  </StyledGuessNumber>
                  <StyledAnswerContainer>
                    {bAnswerList.length + cAnswerList.length === 0 && <i>- empty -</i>}
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
