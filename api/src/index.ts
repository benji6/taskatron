import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as nodemailer from 'nodemailer';
import * as passwordless from 'passwordless'
const MongoStore = require('passwordless-mongostore');
import pino from './pino'
import {get as getMe} from './controllers/me'
import {post as postSendToken} from './controllers/sendToken'

const {PORT} = process.env
const clientHost = 'localhost:3000';

const transporter = nodemailer.createTransport({
  newline: 'unix',
  path: '/usr/sbin/sendmail',
  sendmail: true,
});

passwordless.init(new MongoStore('mongodb://localhost/passwordless-simple-mail'), {
  allowTokenReuse: true
});

passwordless.addDelivery((
  tokenToSend: string,
  uidToSend: string,
  recipient: string,
  callback: any
) => {
  const text = `Hello!\nAccess your account here: http://${clientHost}/login?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}`

  transporter.sendMail({
    from: '"mu" <noreply@mu.com>',
    html: `<b>${text}</b>`,
    subject: `Token for ${clientHost}`,
    text,
    to: uidToSend,
  })
  .then((info) => {
    pino.info('OTPW email sent: %s', info.messageId)
    callback(null)
  })
  .catch(err => {
    pino.error(err)
    callback(err)
  });
}, {
  ttl: 1e3 * 60 * 60 * 24 * 90,
});

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
