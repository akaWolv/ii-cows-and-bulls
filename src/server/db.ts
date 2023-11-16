import flatCache from 'flat-cache'

import {
  Game,
  GameCode,
  Guess,
  SocketId,
  Store,
  User,
  UserCode,
  UserGameNumber,
} from 'types/CommonTypes'
import { UserStatus } from 'constants/UserStatus'
import { Md5 } from 'ts-md5'
import { resolve } from 'path'

type UserAndGameData = { user?: User, game?: Game }
export type registerUserToRoom = { gameCode: GameCode, userCode: UserCode, socketId: SocketId }

const NUMBER_OF_PLAYERS = 2

// const getTodayDate = () => new Date()
//   .toLocaleString('default', { timeZone: 'Europe/Warsaw' })
//   .split(/[.,\s]/)
//   .slice(0,3)
//   .reverse()
//   .join('-')
const cache = flatCache.load('2023', resolve('./.cache'));
const STORE: Store = cache.getKey('games') || {games: []}
setInterval(() => {
  console.log('saved', STORE)
  cache.setKey('games', STORE);
  cache.save(true)
}, 10 * 1000)

const dbHandler = () => {
  const createGame = (code: GameCode): Game => {
    console.log('createGame', code)
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
    console.log('getGameByCode', code)
    return STORE.games.find(({code: storedCode}) => storedCode === code)
  }
  const registerUserToGame = ({gameCode, userCode, socketId}: registerUserToRoom): UserAndGameData => {
    const game = getGameByCode(gameCode) || createGame(gameCode)
    if (game.users && game.users.length > 0) {
      if (userCode) {
        const userToReconnect = game.users.find(({code}) => code === userCode)
        if (userToReconnect) {
          userToReconnect.id = socketId
          userToReconnect.status = UserStatus.CONNECTED
          return { game, user: userToReconnect}
        }
      } else {
        const disconnectedUsers = game.users.filter(({status}) => status === UserStatus.DISCONNECTED)
        if (disconnectedUsers.length == 1) {
          const userToReplace = disconnectedUsers[0]
          userToReplace.id = socketId
          userToReplace.status = UserStatus.CONNECTED
          return { game, user: userToReplace}
        } else if (disconnectedUsers.length > 1) {
          const user = disconnectedUsers.find(({id}) => id == socketId)
          if (user) {
            user.status = UserStatus.CONNECTED
          }
          return { game, user }
        }
      }
    }

    if (game.users.length < NUMBER_OF_PLAYERS) {
      const user = createNewUser(socketId, userCode)
      game.users.push(user)
      return { game, user }
    }
    return {}
  }
  const setUserGameConnectionStatusByUserCode = (userCode: UserCode, status: UserStatus) => {
    const {user} = getUserAndGameByUserCode(userCode)
    if (user) {
      user.status = status
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

  const setUserGameNumberByUserCode = (userCode: UserCode, number: UserGameNumber) => {
    const {user} = getUserAndGameByUserCode(userCode)
    if (user) {
      user.number = number
      return true
    }
    return false
  }

  const getUserAndGameByUserCode = (userCode: UserCode): UserAndGameData => {
    for (const game of STORE.games) {
      const {users} = game
      for (const user of users) {
        const {code} = user
        if (code === userCode) {
          return {
            user,
            game
          }
        }
      }
    }
    return {}
  }
  const getUsersAndGamesListBySocketId = (socketId: SocketId): UserAndGameData[] => {
    return STORE.games.reduce((collection, game) => {
      const {users} = game
      const user = users.find(({id}) => id == socketId)
      user && collection.push({game, user})
      return collection
    }, [] as UserAndGameData[])
  }

  return {
    addUserGuess,
    registerUserToGame,
    getGameByCode,
    getUsersAndGamesListBySocketId,
    getUserAndGameByUserCode,
    setUserWin,
    setUserGameNumberByUserCode,
    setUserGameConnectionStatusByUserCode
  }
}

export default dbHandler
