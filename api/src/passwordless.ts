import * as nodemailer from 'nodemailer';
import * as passwordless from 'passwordless'
const MongoStore = require('passwordless-mongostore');
import pino from './pino'

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
