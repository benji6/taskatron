import ICredentials from './types/ICredentials'
import ISignUpBody from './types/ISignUpBody'

const origin = 'http://localhost:3001'

export const getMe = ({token, uid}: ICredentials): Promise<Response> => fetch(`${origin}/me?token=${token}&uid=${encodeURIComponent(uid)}`)

export const sendToken = (email: string): Promise<Response> => fetch(`${origin}/send-token`, {
  body: JSON.stringify({user: email}),
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'post',
})

export const signUp = (data: ISignUpBody): Promise<Response> => fetch(`${origin}/sign-up`, {
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'post',
})
