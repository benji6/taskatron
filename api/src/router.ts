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
} from './controllers/services/cleaning'
import {
  del as deleteGardening,
  get as getGardening,
  post as postGardening,
  put as putGardening,
} from './controllers/services/gardening'
import {
  del as deleteIroning,
  get as getIroning,
  post as postIroning,
  put as putIroning,
} from './controllers/services/ironing'
import { get as getSignOut } from './controllers/signOut'
import {
  getServices as getUserServices,
  post as postUser,
} from './controllers/user'
import { getUserByEmail } from './model/user'
import passwordless from './passwordless/index'
import { CLEANING, GARDENING, IRONING } from './shared/services'
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

router.delete(
  `/services/${CLEANING}/:id`,
  passwordless.restricted(),
  deleteCleaning,
)
router.get(`/services/${CLEANING}`, getCleaning)
router.post(`/services/${CLEANING}`, passwordless.restricted(), postCleaning)
router.put(`/services/${CLEANING}/:id`, passwordless.restricted(), putCleaning)

router.delete(
  `/services/${GARDENING}/:id`,
  passwordless.restricted(),
  deleteGardening,
)
router.get(`/services/${GARDENING}`, getGardening)
router.post(`/services/${GARDENING}`, passwordless.restricted(), postGardening)
router.put(
  `/services/${GARDENING}/:id`,
  passwordless.restricted(),
  putGardening,
)

router.delete(
  `/services/${IRONING}/:id`,
  passwordless.restricted(),
  deleteIroning,
)
router.get(`/services/${IRONING}`, getIroning)
router.post(`/services/${IRONING}`, passwordless.restricted(), postIroning)
router.put(`/services/${IRONING}/:id`, passwordless.restricted(), putIroning)

router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)
router.get('/user/:id/services', getUserServices)

export default router
