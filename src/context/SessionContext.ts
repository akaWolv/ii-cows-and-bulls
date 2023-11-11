import { createContext } from 'react';
import { SessionData } from 'types/CommonTypes.ts';

export const DEFAULT_SESSION_DATA = {
  game: {},
  user: {},
}

const SessionContext = createContext(DEFAULT_SESSION_DATA as SessionData);
export default SessionContext
