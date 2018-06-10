import {IUserPostBody, IUserRecord} from './shared/types'
import ICredentials from './types/ICredentials'

const origin = 'http://localhost:3001'

const postHeaders = {
  'Content-Type': 'application/json'
}

const postConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: postHeaders,
  method: 'post',
})

export const getMe = ({token, uid}: ICredentials): Promise<IUserRecord> => fetch(`${origin}/me?token=${token}&uid=${encodeURIComponent(uid)}`)
  .then(response => {
    if (!response.ok) throw Error(`${response.status}: ${response.statusText}`)
    return response
  })
  .then(response => response.json())

export const postUser = (user: IUserPostBody): Promise<Response> => fetch(`${origin}/user`, postConfig(user))
  .then(response => {
    if (!response.ok) throw Error(`${response.status}: ${response.statusText}`)
    return response
  })

export const sendToken = (email: string): Promise<Response> => fetch(`${origin}/send-token`, postConfig({user: email}))

export const signUp = (data: IUserPostBody): Promise<Response> => fetch(`${origin}/sign-up`, postConfig(data))
