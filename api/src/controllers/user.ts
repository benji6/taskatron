import { NextFunction, Request, Response } from 'express'
import { getUserByEmail, getUserServices, setUser } from '../model/user'
import passwordless from '../passwordless/index'
import pino from '../pino'
import { IUserPostBody } from '../shared/types'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../shared/validation'

export const getServices = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const serviceDocuments = await getUserServices(id)
    res.status(200).send(serviceDocuments)
  } catch (e) {
    pino.error('GET /user/:id/services', e)
    res.status(500).end()
  }
}

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

    const userDocument = await setUser(body)

    passwordless.requestToken(
      (email: string, delivery: any, callback: any) => {
        pino.info(`user post success, user id: ${userDocument._id}`)
        callback(null, userDocument._id)
        res.status(201).send(userDocument)
      },
      { userField: 'email' },
    )(req, res, next)
  } catch (e) {
    pino.error('user post fail', e)
    res.status(500).end()
  }
}
