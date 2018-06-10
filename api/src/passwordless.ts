import * as config from 'config'
import * as Mailgun from 'mailgun-js'
import * as passwordless from 'passwordless'
const MongoStore = require('passwordless-mongostore');
import pino from './pino'

const clientHost = 'localhost:3000';
const mailgunDomain = 'sandboxe27535c7d6394776b917ab1bf7c49eed.mailgun.org'

const mailgun = Mailgun({
  apiKey: config.get('mailgunApiKey'),
  domain: mailgunDomain,
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

  const data = {
    from: `Excited User <mailgun@${mailgunDomain}>`,
    subject: `Token for ${clientHost}`,
    text,
    to: uidToSend,
  };

  mailgun.messages().send(data, (err, body) => {
    if (err) {
      pino.error(err)
      callback(err)
      return
    }
    pino.info(body, 'OTPW email sent')
    callback(null)
  });
}, {
  ttl: 1e3 * 60 * 60 * 24 * 90,
});
