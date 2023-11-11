// import { generateRandomKey } from './helpers.ts'

import { Game, GameCode, Store, User, UserCode, UserGameNumber, UserId, UserStatus } from '../types/CommonTypes.ts';
import { Md5 } from 'ts-md5';

export type registerUserToRoom = { gameCode: GameCode, userCode: UserCode, userId: UserId }
type UserAndGameData = { user?: User, game?: Game }
const STORE: Store = {games: []}

const dbHandler = () => {
  const createGame = (code: GameCode): Game => {
    const newRoom = {code, users: []}
    STORE.games.push(newRoom)
    return newRoom
  }
  const createNewUser = (userId: UserId, userCode: UserCode): User => {
    return {
      id: userId,
      code: userCode,
      status: UserStatus.CONNECTED,
      guesses: [
        {number: '1234', cows: 1, bulls: 2},
        {number: '4602', cows: 2, bulls: 0},
        {number: '3456', cows: 0, bulls: 1},
        {number: '5489', cows: 0, bulls: 4},
      ],
      codeHash: Md5.hashStr(userCode),
      number: ''
    }
  }
  const getGameByCode = (code: GameCode): Game | undefined => {
    return STORE.games.find(({code: storedCode}) => storedCode === code)
  }
  const getGameByUserId = (userId: UserId): Game | undefined => {
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
  const getUserById = (userId: UserId): User | undefined => {
    let userFound
    STORE.games.forEach(({users}) => {
      users.forEach(user => {
        const {id} = user
        if (id == userId) {
          userFound = user
        }
      })
    })
    return userFound
  }
  const registerUserToRoom = ({gameCode, userCode, userId}: registerUserToRoom) => {
    const game = getGameByCode(gameCode) || createGame(gameCode)
    // get same type
    if (game.users && game.users.length > 0) {
      const userToReplace = game.users.find(({code}) => code === userCode)
      if (userToReplace) {
        // TODO: replace user or add socket client?
        userToReplace.id = userId
        userToReplace.status = UserStatus.CONNECTED
        return true
      }
    }

    game.users.push(createNewUser(userId, userCode))
    console.log('game.users', game.users)
    return true
  }
  const getUsersInGame = (code: GameCode) => {
    const game = getGameByCode(code)
    return game ? game.users : []
  }
  const isUserInGame = (userCode: UserCode, gameCode: GameCode) => {
    return Boolean(getUserByGameAndCode(gameCode, userCode)) ?? false
  }
  const unsubscribeUserById = (userId: UserId) => {
    console.log('unsubscribeUserById', 'games', STORE)
    console.log('unsubscribeUserById', 'userId', userId)
    STORE.games.find((game) => {
      if (game.users.length == 0) {
        return;
      }

      const userIndex = game.users.findIndex(({id}) => id == userId)
      if (userIndex > -1) {
        const {code, id} = game.users[userIndex]
        console.log('UNSUBSCRIBE', game.code, code, id)
        game.users.splice(userIndex, 1)
      }
    })
  }
  const setUserGameConnectionStatusById = (userId: UserId, status: UserStatus) => {
    STORE.games.find((game) => {
      if (game.users.length == 0) {
        return;
      }

      const user = game.users.find(({id}) => id == userId)
      if (user) {
        user.status = status
      }
    })
  }
  const setUserGameNumberByUserId = (userId: UserId, number: UserGameNumber) => {
    const user = getUserById(userId)
    if (user) {
      user.number = number
      return true
    }
    return false
  }

  return {
    registerUserToRoom,
    getUsersInGame,
    getGameByCode,
    getGameByUserId,
    isUserInGame,
    unsubscribeUserById,
    setUserGameConnectionStatusById,
    setUserGameNumberByUserId,
    getUserAndGameById: (userId: UserId): UserAndGameData => {
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
