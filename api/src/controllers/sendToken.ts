import { NextFunction, Request, Response } from 'express'
import pino from '../pino'

export const postErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err.message.startsWith('Error on the user verification layer')) {
    return res.status(400).end()
  }
  if (err) {
    pino.error(err)
    return res.status(500).end()
  }
  next()
}

export const post = (req: Request, res: Response): void => {
  res.status(200).end()
}
