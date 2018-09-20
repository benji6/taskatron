import * as config from 'config'
import * as Mailgun from 'mailgun-js'
import passwordless from './passwordless'
const MongoStore = require('passwordless-mongostore') // tslint:disable-line no-var-requires
import { getUser } from './model/user'
import pino from './pino'
import { IUserResponse } from './shared/types'

const mailgunDomain = 'sandboxe27535c7d6394776b917ab1bf7c49eed.mailgun.org'

const mailgun = Mailgun({
  apiKey: config.get('mailgunApiKey'),
  domain: mailgunDomain,
})

passwordless.init(
  new MongoStore('mongodb://localhost/passwordless-simple-mail'),
  {
    allowTokenReuse: true,
  },
)

passwordless.addDelivery(
  (
    tokenToSend: string,
    uidToSend: string,
    recipient: string,
    callback: any,
  ) => {
    getUser(uidToSend)
      .then(
        (user?: IUserResponse): void => {
          if (!user) throw Error('user not found')

          const text = `Hello ${user.firstName},

Here's your Taskatron sign in link: ${config.get(
            'clientUrl',
          )}/login?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}

Have fun,
Taskatron`

          const data = {
            from: `Taskatron <mailgun@${mailgunDomain}>`,
            subject: 'Sign in to Taskatron',
            text,
            to: user.email,
          }

          mailgun.messages().send(data, (err, body) => {
            if (err) {
              pino.error(err)
              callback(err)
              return
            }
            pino.info(body, 'OTPW email sent')
            callback(null)
          })
        },
      )
      .catch(
        (err: Error): void => {
          pino.error(err)
          callback(err)
        },
      )
  },
  {
    ttl: 1e3 * 60 * 60 * 24 * 90,
  },
)
