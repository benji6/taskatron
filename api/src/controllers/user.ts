import { NextFunction, Request, Response } from 'express'
import * as passwordless from 'passwordless'
import { getUserByEmail, setUser } from '../model'
import pino from '../pino'
import { IUserPostBody } from '../shared/types'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../shared/validation'

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const body: IUserPostBody = req.body

  if (
    !isValidEmail(body.email) ||
    !isValidFirstName(body.firstName) ||
    !isValidLastName(body.lastName) ||
    !isValidPostcode(body.postcode)
  ) {
    res.status(400).send('invalid request body')
    return next()
  }

  try {
    if (await getUserByEmail(body.email)) return res.status(400).end()

    const userRecord = await setUser(body)
    passwordless.requestToken(
      (user: string, delivery: any, callback: any) => {
        pino.info(`user post success: ${userRecord._id}`)
        res.status(200).send(userRecord)
        callback(null, user)
      },
      { userField: 'email' },
    )(req, res, next)
  } catch (e) {
    pino.error('user post fail', e)
    res.status(500).end()
  }
}
