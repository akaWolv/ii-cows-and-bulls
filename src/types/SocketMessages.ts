import { GameCode, UserCode, UserGameNumber } from 'types/CommonTypes.ts';

export type connectToGameByCodesMsg = { userCode?: UserCode, gameCode?: GameCode, isJoiningGame?: boolean }
export type setNumberForUserInGameMsg = { number: UserGameNumber, userCode: UserCode }
export type guessMsg = { number: UserGameNumber, userCode: UserCode }
