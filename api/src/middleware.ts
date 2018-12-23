import { NextFunction, Request, Response } from 'express'
import { IUserResponse } from 'shared/types'
import { getUserByEmail } from './model/users'
import passwordless from './passwordless'
import pino from './pino'

interface IRequest extends Request {
  passwordless?: { uidToAuth?: string }
  user?: string
}

export const postErrorMiddleware = (
  err: Error,
  _: Request,
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

export const restricted = () => (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) return next()
  res.setHeader('WWW-Authenticate', 'Provide a token')
  res.status(401).end('Unauthorized')
}

export const sendTokenMiddleware = passwordless.requestToken(
  (email: string, _: unknown, callback: any) => {
    getUserByEmail(email)
      .then((userResponse?: IUserResponse) => {
        if (userResponse) return callback(null, userResponse._id)
        callback(Error(`Email address not recognised: ${email}`))
      })
      .catch((err: Error) => callback(err))
  },
)
