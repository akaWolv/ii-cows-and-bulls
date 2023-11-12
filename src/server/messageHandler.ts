import { Md5 } from 'ts-md5';
import dbHandler from "./db";
import { Game, Guess, SessionGameData, User, UserGameNumber, UserStatus } from "types/CommonTypes";
import { Server, Socket } from 'socket.io';
import {
  ERROR_MESSAGE,
  GAME_STATUS_MSG_CONCLUDED,
  GAME_STATUS_MSG_JOINING,
  GAME_STATUS_MSG_PLAYING,
  GAME_STATUS_MSG_PREPARE,
  GAME_STATUS_MSG_SUSPENDED,
  SESSION_GAME_DATA,
  SESSION_USER_DATA
} from "constants/SocketMessages";
import { generateRandomKey, isGameCode, isUserCode, isUserGameNumber } from 'helpers'
import { connectToGameByCodesMsg, guessMsg, setNumberForUserInGameMsg } from 'types/SocketMessages.ts';

const NUMBER_OF_PLAYERS = 2

const messageHandler = (io: Server, socket: Socket) => {
  const db = dbHandler()
  const getGameStatus = (game: Game) => {
    const {users} = game
    const haveAllUsersJoined = (users: User[]) => {
      return users.length == NUMBER_OF_PLAYERS
    }
    const haveAllUsersTheirNumberSet = (users: User[]) => {
      return users.reduce((acc, {number}) => number.length > 0 ? ++acc : 0, 0) == NUMBER_OF_PLAYERS
    }
    const isGameConcluded = (users: User[]) => {
      const totalGuesses = users.reduce((total, {guesses}) => total + guesses.length, 0)
      if (totalGuesses % NUMBER_OF_PLAYERS == 0) {
        return users.filter(({isWin}) => isWin).length > 0
      }
    }
    const areAllUsersConnected = (users: User[]) => {
      return users.filter(({status}) => status == UserStatus.CONNECTED).length == NUMBER_OF_PLAYERS
    }

    if (haveAllUsersJoined(users)) {
      if (haveAllUsersTheirNumberSet(users)) {
        if (isGameConcluded(users)) {
          return GAME_STATUS_MSG_CONCLUDED
        }
        if (areAllUsersConnected(users)) {
          return GAME_STATUS_MSG_PLAYING
        }
        return GAME_STATUS_MSG_SUSPENDED
      } else {
        return GAME_STATUS_MSG_PREPARE
      }
    } else {
      return GAME_STATUS_MSG_JOINING
    }
  }
  const getUserGuessReport = (game: Game) => {
    const {users} = game
    if (users) {
      const numberOfMutualGuesses = users.reduce(
        (previousNumberOfGuesses, {guesses}) =>
          previousNumberOfGuesses < guesses.length ? previousNumberOfGuesses : guesses.length
        , Number.MAX_SAFE_INTEGER)

      return users.reduce((collection, {codeHash, guesses}) => {
        return {...collection, [codeHash]: {numberOfGuessesMade: guesses.length, visibleGuesses: guesses.slice(0, numberOfMutualGuesses)}}
      }, {})
    }

    return {}
  }
  const calculateGuess = (opponentNumber: UserGameNumber, guessNumber: UserGameNumber): Guess => {
    let cows = 0, bulls = 0
    if (opponentNumber == guessNumber) {
      bulls = 4
    } else {
      const opponentNumberSplit = opponentNumber.split('')
      const guessNumberSplit = guessNumber.split('')
      guessNumberSplit.forEach((digit, index) => {
        const foundIndex = opponentNumberSplit.indexOf(digit)
        if (foundIndex > -1) {
          if (foundIndex == index) {
            bulls++
          } else {
            cows++
          }
        }
      })
    }
    return {number: guessNumber, cows, bulls}
  }

  const emitter = {
    sessionPrivateUserData: () => {
      const {user} = db.getUserAndGameBySocketId(socket.id)
      if (!user) {
        emitter.error('User not found', 'user_not_found')
        return
      }

      const responseData = {...user, codeHash: Md5.hashStr(user.code)}
      socket.emit(SESSION_USER_DATA, responseData)

      console.log(SESSION_USER_DATA, responseData)
    },
    sessionPublicGameData: () => {
      const {game} = db.getUserAndGameBySocketId(socket.id)
      if (!game) {
        return emitter.error('User or game not found', 'user_or_game_not_found')
      }

      const {users, code: gameCode} = game

      const winners = users.filter(({isWin}) => isWin).map(({codeHash}) => codeHash)
      const responseData: SessionGameData = {
        code: gameCode,
        status: getGameStatus(game),
        usersHashList: users.map(({codeHash}) => codeHash),
        connectedHashList: users.filter(({status}) => status == UserStatus.CONNECTED).map(({codeHash}) => codeHash),
        winners,
        usersGuessList: getUserGuessReport(game)
      }

      io.to(gameCode).emit(SESSION_GAME_DATA, responseData)

      console.log(SESSION_GAME_DATA, responseData)
    },
    error: (text: string, key: string = 'generic') => {
      socket.emit(ERROR_MESSAGE, {text, key})
    }
  }

  return {
    connectToGameByCodes: ({gameCode: givenGameCode, userCode: givenUserCode, isJoiningGame}: connectToGameByCodesMsg) => {
      if (givenGameCode && !isGameCode(givenGameCode)) {
        emitter.error('Game code is invalid', 'invalid_game_code')
        return false
      }
      if (givenUserCode && !isUserCode(givenUserCode)) {
        emitter.error('Invalid user code', 'invalid_user_code')
        return false
      }

      const fixedGivenGameCode = givenGameCode ? givenGameCode.toUpperCase() : undefined
      if (isJoiningGame && (!fixedGivenGameCode || !db.getGameByCode(fixedGivenGameCode))) {
        return emitter.error('Game code is invalid', 'invalid_game_code')
      }

      const gameCode = fixedGivenGameCode || generateRandomKey()
      const userCode = givenUserCode || generateRandomKey()

      void socket.join(gameCode)
      if (db.registerUserToRoom({gameCode, userCode, socketId: socket.id})) {
        emitter.sessionPublicGameData()
        emitter.sessionPrivateUserData()
        return
      }
      return emitter.error('Game code is invalid', 'invalid_game_code')
    },
    setNumberForUserInGame: ({number}: setNumberForUserInGameMsg) => {
      if (number == undefined || !isUserGameNumber(number)) {
        return emitter.error('Invalid number', 'invalid_user_game_number')
      }

      const {game} = db.getUserAndGameBySocketId(socket.id)
      if (!game) {
        return emitter.error('User or game not found', 'user_or_game_not_found')
      }

      if (GAME_STATUS_MSG_PREPARE != getGameStatus(game)) {
        return emitter.error('It\'s not game preparation phase', 'user_or_game_invalid_state')
      }

      if (db.setUserGameNumberByUserSocketId(socket.id, number)) {
        emitter.sessionPublicGameData()
        emitter.sessionPrivateUserData()
        return
      }
      emitter.error('Cannot find user', 'cannot_find_user')
    },
    disconnectUserFromGame: () => {
      if (db.setUserGameConnectionStatusBySocketId(socket.id, UserStatus.DISCONNECTED)) {
        return emitter.sessionPublicGameData()
      }
    },
    guess: ({number}: guessMsg) => {
      const {user, game} = db.getUserAndGameBySocketId(socket.id)
      if (!game) {
        return emitter.error('Cannot find game', 'cannot_find_game')
      }
      if (!user) {
        return emitter.error('Cannot find user', 'cannot_find_user')
      }

      const users = game.users.reduce((users, iteratedUser) => {
        if (iteratedUser.id == user.id) {
          return {...users, current: iteratedUser}
        } else {
          return {...users, opponent: iteratedUser}
        }
      }, {} as { current: User, opponent: User })

      if (Object.keys(users).length != NUMBER_OF_PLAYERS) {
        return emitter.error('Invalid number of users', 'invalid_number_of_users')
      }

      const guess = calculateGuess(users.opponent.number, number)
      if (db.addUserGuess(user, guess)) {
        const isWin = ({bulls}: Guess) => bulls == 4
        isWin(guess) && db.setUserWin(user)

        emitter.sessionPublicGameData()
        emitter.sessionPrivateUserData()
        return
      }
    }
  }
}

export default messageHandler
