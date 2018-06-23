import { NextFunction, Request, Response } from 'express'
import * as passwordless from 'passwordless'
import { insertUser } from '../model'
import pino from '../pino'
import { IUserPostBody, IUserRecord } from '../shared/types'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
} from '../shared/validation'

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
      passwordless.requestToken(
        (user: string, delivery: any, callback: any) => {
          pino.info(`user post success: ${userRecord._id}`)
          res.status(200).send(userRecord)
          callback(null, user)
        },
        { userField: 'email' },
      )(req, res, next)
    })
    .catch((e: Error) => {
      pino.error('user post fail', e)
      res.status(500).end()
    })
}
