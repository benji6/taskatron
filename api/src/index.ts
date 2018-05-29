import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as passwordless from 'passwordless'
import pino from './pino'
import {get as getMe} from './controllers/me'
import {post as postSendToken} from './controllers/sendToken'
import './passwordless'

const {PORT} = process.env

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(passwordless.acceptToken());

app.get('/me', passwordless.restricted(), getMe)

app.post(
  '/send-token',
  passwordless.requestToken((user: string, delivery: any, callback: any) => {
    callback(null, user);
  }),
  postSendToken,
)

app.listen(PORT, (): void => pino.info(`API listening on port ${PORT}\n`))
