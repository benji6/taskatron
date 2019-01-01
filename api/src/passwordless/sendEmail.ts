import * as config from 'config'
import * as Mailgun from 'mailgun-js'
import { getUser } from '../model/users'
import pino from '../pino'

export const mailgunDomain =
  'sandboxe27535c7d6394776b917ab1bf7c49eed.mailgun.org'

const mailgun = Mailgun({
  apiKey: config.get('mailgunApiKey'),
  domain: mailgunDomain,
})

export default async ({ token, uid }: { token: string; uid: string }) => {
  const user = await getUser(uid)
  if (!user) throw Error('user Not found')

  const text = `Hello ${user.firstName},

Here's your Cleanly sign in link: ${config.get(
    'clientUrl',
  )}/login?token=${token}&uid=${uid}

Have fun,
Cleanly`

  const data = {
    from: `Cleanly <mailgun@${mailgunDomain}>`,
    subject: 'Sign in to Cleanly',
    text,
    to: user.email,
  }

  mailgun.messages().send(data, (err, body) => {
    if (err) {
      pino.error(err)
      throw err
    }
    pino.info(body, 'OTPW email sent')
  })
}
