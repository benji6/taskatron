import * as express from 'express'
import { get as getMe, patch as patchMe } from './controllers/me'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model/user'
import passwordless, { restricted } from './passwordless/index'
import { IUserResponse } from './shared/types'

const router = express.Router()

const sendTokenMiddleware = passwordless.requestToken(
  (email: string, delivery: any, callback: any) => {
    getUserByEmail(email)
      .then((userResponse?: IUserResponse) => {
        if (userResponse) return callback(null, userResponse._id)
        callback(Error(`Email address not recognised: ${email}`))
      })
      .catch((err: Error) => callback(err))
  },
)

router.get('/me', restricted(), getMe)
router.patch('/me', restricted(), patchMe)

router.post(
  '/send-token',
  sendTokenMiddleware,
  postSendTokenErrorMiddleware,
  postSendToken,
)

router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)

export default router
