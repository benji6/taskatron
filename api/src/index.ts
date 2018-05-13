import * as cors from 'cors'
import * as express from 'express'
import {get as getSignIn} from './routeHandlers/signIn'
import pino from './pino'

const {PORT} = process.env

const app = express()

app.use(cors())

app.get('/sign-in', getSignIn)

app.listen(PORT, (): void => pino.info(`API listening on port ${PORT}\n`))
