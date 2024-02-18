// const apiGetAll = (req: Request, res: Response) => {
import { RequestHandler } from 'express'
import dbHandler from 'server/db.ts'

const API_KEY: string = '3e127d616722284215dd9302cec78d01'
const db = dbHandler()

const apiGetAll: RequestHandler = (req, res) => {
  const apiKey = req.query.key ?? req.headers.authorization ?? false
  if (apiKey != API_KEY) {
    res.status(401)
    return res.end()
  }

  return res.json(db.getWholeStore())
}

export {
  apiGetAll
}
