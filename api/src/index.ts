import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cors from 'cors'
import * as express from 'express'
import * as morgan from 'morgan'
import passwordless from './passwordless/index'
import pino from './pino'
import router from './router'
import './setupPasswordless'

const port = config.get('port')

const app = express()

app.use(
  morgan(
    ':remote-addr :remote-user [:date] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
  ),
)
app.use(bodyParser.json())
app.use(cors())
app.use(passwordless.acceptToken())
app.use('/', router)

app.listen(port, (): void => pino.info(`API listening on port ${port}\n`))
