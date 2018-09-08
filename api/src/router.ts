import * as express from 'express'
import { get as getMe, patch as patchMe } from './controllers/me'
import {
  del as deleteServices,
  get as getServices,
} from './controllers/myServices'
import {
  post as postCleaning,
  put as putCleaning,
} from './controllers/myServices/cleaning'
import {
  post as postGardening,
  put as putGardening,
} from './controllers/myServices/gardening'
import {
  post as postIroning,
  put as putIroning,
} from './controllers/myServices/ironing'
import {
  post as postSendToken,
  postErrorMiddleware as postSendTokenErrorMiddleware,
} from './controllers/sendToken'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import { getUserByEmail } from './model/user'
import passwordless from './passwordless/index'
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
router.patch('/me', passwordless.restricted(), patchMe)

router.delete('/me/services', passwordless.restricted(), deleteServices)
router.get('/me/services', passwordless.restricted(), getServices)

router.post('/me/services/cleaning', passwordless.restricted(), postCleaning)
router.put('/me/services/cleaning', passwordless.restricted(), putCleaning)

router.post('/me/services/gardening', passwordless.restricted(), postGardening)
router.put('/me/services/gardening', passwordless.restricted(), putGardening)

router.post('/me/services/ironing', passwordless.restricted(), postIroning)
router.put('/me/services/ironing', passwordless.restricted(), putIroning)

router.post(
  '/send-token',
  sendTokenMiddleware,
  postSendTokenErrorMiddleware,
  postSendToken,
)

router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)

export default router
