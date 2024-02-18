import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import dbHandler from 'server/db.ts'

dotenv.config()

const API_KEY: string = process.env.API_KEY || 'pnfaisdf2093rjd-m2lmwemf'
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
