import * as base58 from 'bs58'
import * as crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import MongoStore from './MongoStore'
import sendEmail from './sendEmail'

interface IRequest extends Request {
  passwordless?: { uidToAuth?: string }
  user?: string
}

type GetUserId = (
  user: any,
  delivery: string,
  callback: any,
  req: IRequest,
) => void

const tokenStore = new MongoStore()

const generateToken = (): string => base58.encode(crypto.randomBytes(16))

const send401 = (res: Response, authenticate?: string) => {
  res.statusCode = 401
  if (authenticate) res.setHeader('WWW-Authenticate', authenticate)
  res.end('Unauthorized')
}

class Passwordless {
  public acceptToken() {
    return (req: IRequest, res: Response, next: NextFunction) => {
      const authorizationHeader = req.header('authorization')

      if (!authorizationHeader) return next()

      const [, token, uid] = authorizationHeader.split(' ')

      if (!token || !uid) return next()

      tokenStore.authenticate(
        token,
        uid.toString(),
        (error: Error, valid: boolean) => {
          if (valid) {
            req.user = uid
            next()
          } else if (error) {
            next('TokenStore.authenticate() error: ' + error)
          } else {
            next()
          }
        },
      )
    }
  }

  public logout() {
    return (req: IRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        tokenStore.invalidateUser(req.user, () => {
          delete req.user
          next()
        })
      } else {
        next()
      }
    }
  }

  public requestToken(getUserID: GetUserId, options?: { userField: string }) {
    return (req: IRequest, res: Response, next: NextFunction) => {
      const sendError = (statusCode: number, authenticate?: string) => {
        if (statusCode === 401) send401(res, authenticate)
        else res.status(statusCode).send()
      }

      if (!req.body) {
        throw new Error(
          'req.body does not exist: did you require middleware to accept POST data (such as body-parser) before calling acceptToken?',
        )
      }

      let user: any
      let delivery

      const userField =
        options && options.userField ? options.userField : 'user'

      if (req.body && req.method === 'POST') {
        user = req.body[userField]
        delivery = req.body.delivery
      }

      if (typeof user === 'string' && user.length === 0) {
        return sendError(401, 'Provide a valid user')
      } else if (!user) {
        return sendError(400)
      }

      getUserID(
        user,
        delivery,
        (uidError: Error, uid: string) => {
          if (uidError) {
            next(new Error('Error on the user verification layer: ' + uidError))
          } else if (uid) {
            let token: string

            try {
              token = generateToken()
            } catch (err) {
              return next(new Error('Error while generating a token: ' + err))
            }

            tokenStore.storeOrUpdate(
              token,
              uid.toString(),
              1e3 * 60 * 60 * 24 * 90,
              async (storeError: Error) => {
                if (storeError) {
                  next(new Error('Error on the storage layer: ' + storeError))
                } else {
                  try {
                    await sendEmail({
                      token,
                      uid,
                    })
                    if (!req.passwordless) req.passwordless = {}
                    req.passwordless.uidToAuth = uid
                    next()
                  } catch (deliveryError) {
                    next(
                      new Error(
                        'Error on the deliveryMethod delivery layer: ' +
                          deliveryError,
                      ),
                    )
                  }
                }
              },
            )
          } else {
            sendError(401, 'Provide a valid user')
          }
        },
        req,
      )
    }
  }
}

export default new Passwordless()
