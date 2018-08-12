import { Request, Response } from 'express'
import { getUser } from '../model/user'
import pino from '../pino'
import { IUserDocument } from '../shared/types'

interface IRequest extends Request {
  user: string
}

export const get = (req: Request, res: Response): void => {
  getUser((req as IRequest).user)
    .then((user?: IUserDocument) => {
      if (!user) throw Error('user not found')
      res.status(200).send(user)
    })
    .catch((err: Error) => {
      res.status(500).end()
      pino.error(err)
    })
}
