import * as express from 'express'
import * as passwordless from 'passwordless'
import { get as getMe } from './controllers/me'
import { post as postSendToken } from './controllers/sendToken'
import { get as getSignOut } from './controllers/signOut'
import { post as postSignUp } from './controllers/signUp'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model'
import { IUserRecord } from './shared/types'

const router = express.Router()

const sendTokenMiddleware = passwordless.requestToken(
  (user: string, delivery: any, callback: any) => {
    getUserByEmail(user)
      .then((userRecord: IUserRecord) => {
        callback(null, userRecord._id)
      })
      .catch((err: Error) => callback(err))
  },
)

router.get('/me', passwordless.restricted(), getMe)
router.get('/sign-out', passwordless.logout(), getSignOut)
router.post('/send-token', sendTokenMiddleware, postSendToken)
router.post('/sign-up', postSignUp)
router.post('/user', postUser)

export default router
