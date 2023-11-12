import {
  Game,
  GameCode,
  Guess,
  SocketId,
  Store,
  User,
  UserCode,
  UserGameNumber,
  UserStatus
} from '../types/CommonTypes.ts'
import { Md5 } from 'ts-md5'

export type registerUserToRoom = { gameCode: GameCode, userCode: UserCode, socketId: SocketId }
type UserAndGameData = { user?: User, game?: Game }
const STORE: Store = {games: []}
const NUMBER_OF_PLAYERS = 2

const dbHandler = () => {
  const createGame = (code: GameCode): Game => {
    const newRoom = {code, users: []}
    STORE.games.push(newRoom)
    return newRoom
  }
  const createNewUser = (userId: SocketId, userCode: UserCode): User => {
    return {
      id: userId,
      code: userCode,
      status: UserStatus.CONNECTED,
      guesses: [],
      codeHash: Md5.hashStr(userCode),
      number: '',
      isWin: false
    }
  }
  const getGameByCode = (code: GameCode): Game | undefined => {
    return STORE.games.find(({code: storedCode}) => storedCode === code)
  }
  const getGameBySocketId = (userId: SocketId): Game | undefined => {
    return STORE.games.find(
      ({users}) => users && users.find(({id}) => id === userId)
    )
  }
  const getUserByGameAndCode = (gameCode: GameCode, userCode: UserCode): User | undefined => {
    const game = getGameByCode(gameCode)
    if (!game) {
      return undefined
    }

    return game.users.find(({code}) => code === userCode)
  }
  const getUserBySocketId = (socketId: SocketId): User | undefined => {
    let userFound
    STORE.games.forEach(({users}) => {
      users.forEach(user => {
        const {id} = user
        if (id == socketId) {
          userFound = user
        }
      })
    })
    return userFound
  }
  const registerUserToRoom = ({gameCode, userCode, socketId}: registerUserToRoom) => {
    const game = getGameByCode(gameCode) || createGame(gameCode)

    if (game.users && game.users.length > 0) {
      if (userCode) {
        const userToReplace = game.users.find(({code}) => code === userCode)
        if (userToReplace) {
          userToReplace.id = socketId
          userToReplace.status = UserStatus.CONNECTED
          return true
        }
      } else {
        const disconnectedUsers = game.users.filter(({status}) => status === UserStatus.DISCONNECTED)
        if (disconnectedUsers.length == 1) {
          const userToActivate = getUserBySocketId(disconnectedUsers[0].id)
          if (userToActivate) {
            userToActivate.id = socketId
            userToActivate.status = UserStatus.CONNECTED
            return true
          }
        }
      }
    }

    if (game.users.length < NUMBER_OF_PLAYERS) {
      game.users.push(createNewUser(socketId, userCode))
      return true
    }
    return false
  }
  const getUsersInGame = (code: GameCode) => {
    const game = getGameByCode(code)
    return game ? game.users : []
  }
  const isUserInGame = (userCode: UserCode, gameCode: GameCode) => {
    return Boolean(getUserByGameAndCode(gameCode, userCode)) ?? false
  }
  const setUserGameConnectionStatusBySocketId = (socketId: SocketId, status: UserStatus) => {
    const user = getUserBySocketId(socketId)
    if (user) {
      user.status = status
      return true
    }
    return false
  }
  const setUserGameNumberByUserSocketId = (socketId: SocketId, number: UserGameNumber) => {
    const user = getUserBySocketId(socketId)
    if (user) {
      user.number = number
      return true
    }
    return false
  }
  const addUserGuess = (user: User, guess: Guess) => {
    user.guesses.push(guess)
    return true
  }
  const setUserWin = (user: User) => {
    user.isWin = true
    return true
  }

  return {
    registerUserToRoom,
    getUsersInGame,
    getGameByCode,
    getGameBySocketId,
    isUserInGame,
    setUserGameConnectionStatusBySocketId,
    setUserGameNumberByUserSocketId,
    addUserGuess,
    setUserWin,
    getUserAndGameBySocketId: (userId: SocketId): UserAndGameData => {
      for (const game of STORE.games) {
        const { users } = game
        for (const user of users) {
          const { id } = user
          if (id === userId) {
            return {
              user,
              game
            }
          }
        }
      }
      return {}
    }
  }
}


export default dbHandler
