import {NextFunction, Request, Response} from 'express'
import {IUserPostBody, IUserRecord} from '../shared/types'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
} from '../shared/validation'
import pino from '../pino'
import {insertUser} from '../model'

export const post = (req: Request, res: Response, next: NextFunction) => {
  const body: IUserPostBody = req.body

  if (
    !isValidEmail(body.email) ||
    !isValidFirstName(body.firstName) ||
    !isValidLastName(body.lastName)
  ) {
    res.status(400).send('invalid request body')
    return next()
  }

  insertUser(body)
    .then((userRecord: IUserRecord) => {
      pino.info('user post success', userRecord)
      res.status(200).send(userRecord)
      next()
    })
    .catch((e: Error) => {
      pino.error('user post fail', e)
      res.status(500).end()
    })
}
