import * as base58 from 'bs58'
import * as crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'

type TokenStore = any

interface IRequest extends Request {
  passwordless?: { uidToAuth?: string }
  user?: string
}

type SendToken = (
  tokenToSend: string,
  uidToSend: string,
  recipient: string,
  callback: any,
  req: IRequest,
) => void

interface IAddDeliveryOptions {
  ttl: number
}

type GetUserId = (
  user: any,
  delivery: string,
  callback: any,
  req: IRequest,
) => void

interface IDelivery {
  options: IAddDeliveryOptions
  sendToken: SendToken
}

const generateToken = (): string => base58.encode(crypto.randomBytes(16))

const send401 = (res: Response, authenticate?: string) => {
  res.statusCode = 401
  if (authenticate) res.setHeader('WWW-Authenticate', authenticate)
  res.end('Unauthorized')
}

class Passwordless {
  private defaultDelivery?: IDelivery = undefined
  private tokenStore?: TokenStore = undefined

  public init(tokenStore: TokenStore) {
    this.tokenStore = tokenStore
  }

  public acceptToken() {
    return (req: IRequest, res: Response, next: NextFunction) => {
      if (!this.tokenStore) {
        throw new Error(
          'Passwordless is missing a TokenStore. Are you sure you called passwordless.init()?',
        )
      }
      const authorizationHeader = req.header('authorization')

      if (!authorizationHeader) return next()

      const [, token, uid] = authorizationHeader.split(' ')

      if (!token || !uid) return next()

      this.tokenStore.authenticate(
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
        this.tokenStore.invalidateUser(req.user, () => {
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

      if (!this.tokenStore) {
        throw new Error(
          'Passwordless is missing a TokenStore. Are you sure you called passwordless.init()?',
        )
      }

      if (!req.body) {
        throw new Error(
          'req.body does not exist: did you require middleware to accept POST data (such as body-parser) before calling acceptToken?',
        )
      } else if (!this.defaultDelivery) {
        throw new Error(
          'passwordless requires at least one delivery method which can be added using passwordless.addDelivery()',
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

      const deliveryMethod = this.defaultDelivery

      if (typeof user === 'string' && user.length === 0) {
        return sendError(401, 'Provide a valid user')
      } else if (!deliveryMethod || !user) {
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

            const ttl = deliveryMethod.options.ttl || 60 * 60 * 1000

            this.tokenStore.storeOrUpdate(
              token,
              uid.toString(),
              ttl,
              (storeError: Error) => {
                if (storeError) {
                  next(new Error('Error on the storage layer: ' + storeError))
                } else {
                  deliveryMethod.sendToken(
                    token,
                    uid,
                    user,
                    (deliveryError: Error) => {
                      if (deliveryError) {
                        next(
                          new Error(
                            'Error on the deliveryMethod delivery layer: ' +
                              deliveryError,
                          ),
                        )
                      } else {
                        if (!req.passwordless) req.passwordless = {}
                        req.passwordless.uidToAuth = uid
                        next()
                      }
                    },
                    req,
                  )
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

  public addDelivery(sendToken: SendToken, options: IAddDeliveryOptions) {
    options = options || {}

    if (this.defaultDelivery) {
      throw new Error(
        'Only one default delivery method shall be defined and not be mixed up with named methods. Use named delivery methods instead',
      )
    }

    this.defaultDelivery = {
      options,
      sendToken,
    }
  }
}

export default new Passwordless()
