import { NextFunction, Request, Response } from 'express'

interface IRequest extends Request {
  passwordless?: { uidToAuth?: string }
  user?: string
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
