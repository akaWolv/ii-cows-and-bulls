import { Md5 } from 'ts-md5';
import dbHandler from "server/db";
import { UserStatus } from 'constants/UserStatus.ts';
import { Server, Socket } from 'socket.io';
import {
  MSG_ERROR,
  MSG_SESSION_GAME_DATA,
  MSG_SESSION_USER_DATA
} from "constants/SocketMessages.ts";
import { isGameCode, isUserCode, isUserGameNumber } from 'helpers'
import { Game, Guess, SessionGameData, User, UserAndGameData, UserCode, UserGameNumber } from "types/CommonTypes";
import { connectToGameByCodesMsg, guessMsg, setNumberForUserInGameMsg } from 'types/SocketMessages';
import { GameStatus } from 'constants/GameStatus';


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
      if (isGameConcluded(users)) {
        return GameStatus.CONCLUDED
      }
      if (!areAllUsersConnected(users)) {
        return GameStatus.SUSPENDED
      }
      if (!haveAllUsersTheirNumberSet(users)) {
        return GameStatus.PREPARE
      }
      return GameStatus.PLAYING
    }

    return GameStatus.JOINING
  }
  const getUserGuessReport = (game: Game) => {
    const {users} = game
    if (users) {
      const numberOfMutualGuesses = users.reduce(
        (previousNumberOfGuesses, {guesses}) =>
          previousNumberOfGuesses < guesses.length ? previousNumberOfGuesses : guesses.length
        , Number.MAX_SAFE_INTEGER)

      return users.reduce((collection, {codeHash, guesses}) => {
        return {
          ...collection,
          [codeHash]: {
            numberOfGuessesMade: guesses.length,
            visibleGuesses: guesses.slice(0, numberOfMutualGuesses),
            pendingGuess: guesses.slice(numberOfMutualGuesses, numberOfMutualGuesses + 1)[0]
          }
        }
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
    sessionPrivateUserData: (userCode: UserCode) => {
      const {user}: UserAndGameData = db.getUserAndGameByUserCode(userCode)
      if (!user) {
        emitter.error('User not found', 'user_not_found')
        return
      }

      const responseData = {...user, codeHash: Md5.hashStr(user.code)}
      socket.emit(MSG_SESSION_USER_DATA, responseData)
    },
    sessionPublicGameData: (userCode: UserCode) => {
      // const {game} = db.getUserAndGameBySocketId(socket.id)
      const {game}: UserAndGameData = db.getUserAndGameByUserCode(userCode)
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

      io.to(gameCode).emit(MSG_SESSION_GAME_DATA, responseData)

    },
    error: (text: string, key: string = 'generic') => {
      socket.emit(MSG_ERROR, {text, key})
    }
  }

  return {
    connectToGameByCodes: (
      {
        gameCode: givenGameCode,
        userCode: givenUserCode,
        isJoiningGame
      }: connectToGameByCodesMsg
    ) => {
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
        return emitter.error('Game not found', 'game_not_found')
      }

      const gameCode = fixedGivenGameCode
      const userCode = givenUserCode

      const {game, user}: UserAndGameData = db.registerUserToGame({gameCode, userCode, socketId: socket.id})
      if (game) {
        const { code } = game
        void socket.join(code)
      }
      if (user) {
        const { code } = user
        emitter.sessionPublicGameData(code)
        emitter.sessionPrivateUserData(code)
        return
      }
      return emitter.error('Game code is invalid', 'invalid_game_code')
    },
    setNumberForUserInGame: ({number, userCode}: setNumberForUserInGameMsg) => {
      if (number == undefined || !isUserGameNumber(number)) {
        return emitter.error('Invalid number', 'invalid_user_game_number')
      }

      const {game}: UserAndGameData = db.getUserAndGameByUserCode(userCode)
      if (!game) {
        return emitter.error('User or game not found', 'user_or_game_not_found')
      }

      if (getGameStatus(game) != GameStatus.PREPARE) {
        return emitter.error('It\'s not game preparation phase', 'user_or_game_invalid_state')
      }

      if (db.setUserGameNumberByUserCode(userCode, number)) {
        emitter.sessionPublicGameData(userCode)
        emitter.sessionPrivateUserData(userCode)
        return
      }
      emitter.error('Cannot find user', 'cannot_find_user')
    },
    disconnectUserFromGame: () => {
      const collection: UserAndGameData[] = db.getUsersAndGamesListBySocketId(socket.id)
      collection
        .filter(({user}) => user?.status != UserStatus.DISCONNECTED)
        .map(({user}) => {
          if (user) {
            const {code} = user
            db.setUserGameConnectionStatusByUserCode(code, UserStatus.DISCONNECTED)
            emitter.sessionPublicGameData(code)
          }
        })
    },
    guess: ({number, userCode}: guessMsg) => {
      const {user, game}: UserAndGameData = db.getUserAndGameByUserCode(userCode)
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

        emitter.sessionPublicGameData(userCode)
        emitter.sessionPrivateUserData(userCode)
        return
      }
    }
  }
}

export default messageHandler
