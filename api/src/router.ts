import * as express from 'express'
import * as passwordless from 'passwordless'
import { get as getMe } from './controllers/me'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import {
  del as deleteServices,
  get as getServices,
} from './controllers/services'
import {
  post as postCleaning,
  put as putCleaning,
} from './controllers/services/cleaning'
import {
  post as postGardening,
  put as putGardening,
} from './controllers/services/gardening'
import {
  post as postIroning,
  put as putIroning,
} from './controllers/services/ironing'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model/user'
import { IUserDocument } from './shared/types'

const router = express.Router()

const sendTokenMiddleware = passwordless.requestToken(
  (email: string, delivery: any, callback: any) => {
    getUserByEmail(email)
      .then((userDocument?: IUserDocument) => {
        if (userDocument) return callback(null, userDocument._id)
        callback(Error(`Email address not recognised: ${email}`))
      })
      .catch((err: Error) => callback(err))
  },
)

router.get('/me', passwordless.restricted(), getMe)
router.get('/sign-out', passwordless.logout(), getSignOut)
router.post(
  '/send-token',
  sendTokenMiddleware,
  postSendTokenErrorMiddleware,
  postSendToken,
)
router.delete('/services', passwordless.restricted(), deleteServices)
router.get('/services', passwordless.restricted(), getServices)
router.post('/services/cleaning', passwordless.restricted(), postCleaning)
router.put('/services/cleaning', passwordless.restricted(), putCleaning)
router.post('/services/gardening', passwordless.restricted(), postGardening)
router.put('/services/gardening', passwordless.restricted(), putGardening)
router.post('/services/ironing', passwordless.restricted(), postIroning)
router.put('/services/ironing', passwordless.restricted(), putIroning)
router.post('/user', postUser)

export default router
