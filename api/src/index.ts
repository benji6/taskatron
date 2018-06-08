import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as passwordless from 'passwordless'
import pino from './pino'
import router from './router'
import './passwordless'

const {PORT} = process.env

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(passwordless.acceptToken());

app.use('/', router);

app.listen(PORT, (): void => pino.info(`API listening on port ${PORT}\n`))
