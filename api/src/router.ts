import * as express from 'express'
import { get as getMe, patch as patchMe } from './controllers/me'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import {
  del as deleteCleaning,
  get as getCleaning,
  post as postCleaning,
  put as putCleaning,
} from './controllers/service'
import { get as getSignOut } from './controllers/signOut'
import {
  getService as getUserService,
  post as postUser,
} from './controllers/user'
import { getUserByEmail } from './model/user'
import passwordless from './passwordless/index'
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

router.get('/me', passwordless.restricted(), getMe)
router.patch('/me', passwordless.restricted(), patchMe)

router.post(
  '/send-token',
  sendTokenMiddleware,
  postSendTokenErrorMiddleware,
  postSendToken,
)

router.delete(`/service/:id`, passwordless.restricted(), deleteCleaning)
router.get('/service', getCleaning)
router.post('/service', passwordless.restricted(), postCleaning)
router.put('/service/:id', passwordless.restricted(), putCleaning)

router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)
router.get('/user/:id/service', getUserService)

export default router
