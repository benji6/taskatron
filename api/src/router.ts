import * as express from 'express'
import { get as getMe } from './controllers/me'
import { post as postSendToken } from './controllers/sendToken'
import {
  del as deleteServiceImage,
  post as postServiceImage,
  put as putServiceImage,
} from './controllers/serviceImages'
import { get as getSignOut } from './controllers/signOut'
import { post as postUser } from './controllers/user'
import {
  postErrorMiddleware,
  restricted,
  sendTokenMiddleware,
} from './middleware'
import passwordless from './passwordless/index'

const router = express.Router()

router.get('/health', (_, response) => response.status(200).end())
router.get('/me', restricted(), getMe)
router.post(
  '/send-token',
  sendTokenMiddleware,
  postErrorMiddleware,
  postSendToken,
)
router.delete('/services/:id/image', restricted(), deleteServiceImage)
router.post('/services/:id/image/:extension', restricted(), postServiceImage)
router.put('/services/:id/image/:extension', restricted(), putServiceImage)
router.get('/sign-out', passwordless.logout(), getSignOut)

router.post('/user', postUser)

export default router
