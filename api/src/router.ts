import * as express from 'express'
import { IUserResponse } from 'shared/types'
import { get as getMe, patch as patchMe } from './controllers/me'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import {
  del as deleteServiceImage,
  post as postServiceImage,
} from './controllers/serviceImages'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model/user'
import passwordless, { restricted } from './passwordless/index'

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

router.get('/health', (_, response) => response.status(200).end())
router.get('/me', restricted(), getMe)
router.patch('/me', restricted(), patchMe)
router.post(
  '/send-token',
  sendTokenMiddleware,
  postSendTokenErrorMiddleware,
  postSendToken,
)
router.delete('/services/:id/image', restricted(), deleteServiceImage)
router.post('/services/:id/image', restricted(), postServiceImage)
router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)

export default router
