import * as config from 'config'
import * as Mailgun from 'mailgun-js'
import { getUser } from './model/users'
import passwordless from './passwordless'
import pino from './pino'

const mailgunDomain = 'sandboxe27535c7d6394776b917ab1bf7c49eed.mailgun.org'

const mailgun = Mailgun({
  apiKey: config.get('mailgunApiKey'),
  domain: mailgunDomain,
})

passwordless.addDelivery(
  (
    tokenToSend: string,
    uidToSend: string,
    recipient: string,
    callback: any,
  ) => {
    getUser(uidToSend)
      .then(
        (user): void => {
          if (!user) throw Error('user Not found')

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
