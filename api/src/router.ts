import * as express from 'express'
import * as passwordless from 'passwordless'
import {get as getMe} from './controllers/me'
import {post as postSignUp} from './controllers/signUp'
import {post as postSendToken} from './controllers/sendToken'
import {post as postUser} from './controllers/user'
import {getUserByEmail} from './model'
import { IUserRecord } from './shared/types';

const router = express.Router()

router.get('/me', passwordless.restricted(), getMe)
router.post('/sign-up', postSignUp)
router.post('/user', postUser)

router.post(
  '/send-token',
  passwordless.requestToken((user: string, delivery: any, callback: any) => {
    getUserByEmail(user)
      .then((user: IUserRecord) => {
        callback(null, user._id);
      })
      .catch((err: Error) => callback(err))
  }),
  postSendToken,
)

export default router
