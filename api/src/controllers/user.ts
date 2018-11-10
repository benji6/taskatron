import { NextFunction, Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import log from '../log'
import { getUserByEmail, setUser } from '../model/user'
import passwordless from '../passwordless/index'
import geocode from '../services/geocode'
import { UserPostBody } from '../shared/types'

const logUserPost = log('user')('POST')

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req

  if (!UserPostBody.is(body)) {
    res.status(400).end()
    return logUserPost(400, PathReporter.report(UserPostBody.decode(body)))
  }

  try {
    const existingUserDocument = await getUserByEmail(body.email)

    if (existingUserDocument) {
      res.status(409).end()
      return logUserPost(
        409,
        `record for _id: ${existingUserDocument._id} already exists`,
      )
    }

    const coords = await geocode(body.postcode)

    const userDocument = await setUser({ ...body, coords })

    passwordless.requestToken(
      (email: string, delivery: any, callback: any) => {
        callback(null, userDocument._id)
        res.status(201).send(userDocument)
      },
      { userField: 'email' },
    )(req, res, next)
  } catch (e) {
    res.status(500).end()
    logUserPost(500, e)
  }
}
