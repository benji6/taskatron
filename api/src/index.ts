import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cors from 'cors'
import * as express from 'express'
import * as passwordless from 'passwordless'
import './passwordless'
import pino from './pino'
import router from './router'

const port = config.get('port')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(passwordless.acceptToken())

app.use('/', router)

app.listen(port, (): void => pino.info(`API listening on port ${port}\n`))
