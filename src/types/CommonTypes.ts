export enum UserStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected'
}

export type UserCode = string
export type UserId = string
export type GameCode = string
export type UserGameNumber = string
export type Guess = { number: UserGameNumber, cows: number, bulls: number }
export type User = {
  id: string,
  code: UserCode,
  codeHash: string,
  status: UserStatus,
  guesses: Guess[],
  number: UserGameNumber
}
export type Game = { code: GameCode, users: User[] }
export type Store = {
  games: Game[]
}
export type SessionGameData = {
  status: string,
  code: GameCode,
  numberOfPlayers: number,
  usersHashList: string[],
  usersGuessList: {[key: string]: Guess[]}
}
export type SessionUserData = User
export type SessionData = { game: SessionGameData } & { user: SessionUserData }
export type FormValues = {
  digitA: string,
  digitB: string,
  digitC: string,
  digitD: string,
};
