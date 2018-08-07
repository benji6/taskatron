import * as express from 'express'
import * as passwordless from 'passwordless'
import { get as getMe } from './controllers/me'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import { post as postCleaning } from './controllers/service/cleaning'
import { post as postGardening } from './controllers/service/gardening'
import { post as postIroning } from './controllers/service/ironing'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model'
import { IUserRecord } from './shared/types'

const router = express.Router()

const sendTokenMiddleware = passwordless.requestToken(
  (email: string, delivery: any, callback: any) => {
    getUserByEmail(email)
      .then((userRecord?: IUserRecord) => {
        if (userRecord) return callback(null, userRecord._id)
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
router.post('/service/cleaning', passwordless.restricted(), postCleaning)
router.post('/service/gardening', passwordless.restricted(), postGardening)
router.post('/service/ironing', passwordless.restricted(), postIroning)
router.post('/user', postUser)

export default router
