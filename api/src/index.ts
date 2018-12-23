import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cors from 'cors'
import * as express from 'express'
import { maxImageSize } from 'shared/constants'
import apolloServer from './apolloServer'
import passwordless from './passwordless/index'
import pino from './pino'
import router from './router'

const { NODE_ENV } = process.env

const port = config.get('port')

const app = express()

app.use(bodyParser.json({ type: '*/json' }))
app.use(bodyParser.raw({ limit: maxImageSize, type: 'image/*' }))
if (NODE_ENV !== 'production') app.use(cors())
app.use(passwordless.acceptToken())
app.use('/', router)

apolloServer.applyMiddleware({ app, cors: false })

app.listen(
  port,
  (): void =>
    pino.info(`NODE_ENV is ${NODE_ENV}, API listening on port ${port}\n`),
)
