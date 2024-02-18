import { UserStatus } from 'constants/UserStatus.ts';
import { GameStatus } from 'constants/GameStatus.ts';

export type UserCode = string
export type SocketId = string
export type GameCode = string
export type UserGameNumber = string
export type Guess = { number: UserGameNumber, cows: number, bulls: number }
export type CodeHash = string
export type User = {
  id: string
  code: UserCode
  codeHash: CodeHash
  status: UserStatus
  guesses: Guess[]
  isWin: boolean
  number: UserGameNumber
}
export type Game = { code: GameCode, users: User[] }
export type Store = {
  games: Game[]
}
export type SingleUserGuessReport = {
  numberOfGuessesMade: number,
  visibleGuesses: Guess[],
  pendingGuess: Guess
}
export type SessionGameData = {
  status: GameStatus
  code: GameCode
  usersHashList: CodeHash[]
  connectedHashList: CodeHash[]
  winners: CodeHash[]
  usersGuessList: {[key: string]: SingleUserGuessReport}
}
export type SessionUserData = User
export type SessionData = { game: SessionGameData } & { user: SessionUserData } & { isPlayerConnected: boolean, isOpponentConnected: boolean }
export type FormValues = {
  digitA: string
  digitB: string
  digitC: string
  digitD: string
};
export type UserAndGameData = { user?: User, game?: Game }
