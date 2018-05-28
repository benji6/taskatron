import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as nodemailer from 'nodemailer';
import * as passwordless from 'passwordless'
const MongoStore = require('passwordless-mongostore');
import pino from './pino'

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
  const text = `Hello!\nAccess your account here: http://${clientHost}?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}`

  transporter.sendMail({
    from: '"mu" <noreply@mu.com>',
    html: `<b>${text}</b>`,
    subject: `Token for ${clientHost}`,
    text,
    to: 'benji2357@gmail.com',
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

app.post('/send-token', passwordless.requestToken(
  (user: string, delivery: any, callback: any) => {
    callback(null, user);
  }),
  (req, res) => {
    res.sendStatus(200)
  }
)

app.listen(PORT, (): void => pino.info(`API listening on port ${PORT}\n`))
