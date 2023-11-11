import { Md5 } from 'ts-md5';
import dbHandler from "./db";
import { Game, GameCode, Guess, User, UserCode, UserGameNumber, UserStatus } from "types/CommonTypes";
import { Server, Socket } from 'socket.io';
import {
  // CURRENT_CONNECTION_DATA,
  ERROR_MESSAGE,
  SESSION_GAME_DATA,
  GAME_STATUS_MSG_CONNECTING,
  // GAME_STATUS_MSG_NOT_EXIST,
  GAME_STATUS_MSG_PLAYING,
  GAME_STATUS_MSG_PREPARE, SESSION_USER_DATA
} from "constants/SocketMessages";
import { generateRandomKey, isGameCode, isUserCode, isUserGameNumber } from 'helpers'

export type connectToGameByCodes = { userCode?: UserCode, gameCode?: GameCode }
export type setNumberForUserInGame = { number: UserGameNumber }
export type guess = { number: UserGameNumber }

const messageHandler = (io: Server, socket: Socket) => {
  const db = dbHandler()
  const getGameStatus = (game: Game) => {
    const {users} = game
    const areAllUsersConnected = (users: User[]) => {
      return users.length >= 2
    }
    const areAllUserHaveTheirNumberSet = (users: User[]) => {
      return users.reduce((acc, {number}) => number.length > 0 ? ++acc : 0, 0) == 2
    }

    if (areAllUsersConnected(users)) {
      if (areAllUserHaveTheirNumberSet(users)) {
        return GAME_STATUS_MSG_PLAYING
      } else {
        return GAME_STATUS_MSG_PREPARE
      }
    } else {
      return GAME_STATUS_MSG_CONNECTING
    }
  }
  const getUserGuessReport = (game: Game) => {
    const { users } = game
    if (users) {
      return users.reduce((collection, { codeHash, guesses }) => {
        return {...collection, [codeHash]: guesses}
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
      const {user} = db.getUserAndGameById(socket.id)
      if (!user) {
        emitter.error('User not found', 'user_not_found')
        return
      }

      socket.emit(SESSION_USER_DATA, {...user, codeHash: Md5.hashStr(user.code)})
    },
    sessionPublicGameData: () => {
      const {game} = db.getUserAndGameById(socket.id)
      // const game = db.getGameByCode(gameCode)
      if (!game) {
        emitter.error('User or game not found', 'user_or_game_not_found')
        return
      }

      const { users, code: gameCode } = game

      const responseData= {
        code: gameCode,
        status: getGameStatus(game),
        numberOfUsers: users.length,
        usersHashList: users.map(({codeHash}) => codeHash),
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
    connectToGameByCodes: ({gameCode: givenGameCode, userCode: givenUserCode}: connectToGameByCodes) => {
      if (givenGameCode && !isGameCode(givenGameCode)) {
        emitter.error('Game code is invalid', 'invalid_game_code')
        return false
      }
      if (givenUserCode && !isUserCode(givenUserCode)) {
        emitter.error('Invalid user code', 'invalid_user_code')
        return false
      }

      const gameCode = givenGameCode || generateRandomKey()
      const userCode = givenUserCode || generateRandomKey()

      void socket.join(gameCode)
      if (db.registerUserToRoom({gameCode, userCode, userId: socket.id})) {
        emitter.sessionPublicGameData()
        emitter.sessionPrivateUserData()
        return true
      }
      return false
    },
    setNumberForUserInGame: ({number}: setNumberForUserInGame) => {
      if (number == undefined || !isUserGameNumber(number)) {
        emitter.error('Invalid number', 'invalid_user_game_number')
        return false
      }

      if (db.setUserGameNumberByUserId(socket.id, number)) {
        emitter.sessionPublicGameData()
        emitter.sessionPrivateUserData()
        return
      }
      emitter.error('Cannot find user', 'cannot_find_user')
    },
    unsubscribeUserFromGame: () => {
      db.unsubscribeUserById(socket.id)
    },
    disconnectUserFromGame: () => {
      db.setUserGameConnectionStatusById(socket.id, UserStatus.DISCONNECTED)
    },
    guess: ({number}: guess) => {
      const currentUserId = socket.id
      const game = db.getGameByUserId(currentUserId)
      if (!game) {
        emitter.error('Cannot find game', 'cannot_find_game')
        return
      }

      const users = game.users.reduce((users, user) => {
        const {id} = user
        if (id == currentUserId) {
          return {...users, current: user}
        } else {
          return {...users, opponent: user}
        }
      }, {} as { current: User, opponent: User })

      if (Object.keys(users).length != 2) {
        return emitter.error('Invalid number of users', 'invalid_number_of_users')
      }

      users.current.guesses.push(calculateGuess(users.opponent.number, number))
    }
  }
}

export default messageHandler
