import { getCredentials } from './localStorage'
import {
  IServiceCleaningPostBody,
  IUserPostBody,
  IUserRecord,
} from './shared/types'
import ICredentials from './types/ICredentials'

const origin = 'http://localhost:3001'

const postHeaders = {
  'Content-Type': 'application/json',
}

const postConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: postHeaders,
  method: 'post',
})

const credentialsQueryString = ({ token, uid }: ICredentials): string =>
  `token=${token}&uid=${encodeURIComponent(uid)}`

export const getMe = (
  credentialsPromise: Promise<ICredentials>,
): Promise<IUserRecord> =>
  credentialsPromise
    .then(credentials =>
      fetch(`${origin}/me?${credentialsQueryString(credentials)}`),
    )
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const getSignOut = (
  credentialsPromise: Promise<ICredentials>,
): Promise<Response> =>
  credentialsPromise
    .then(credentials =>
      fetch(`${origin}/sign-out?${credentialsQueryString(credentials)}`),
    )
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const postServiceCleaning = async (
  service: IServiceCleaningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service/cleaning?${credentialsQueryString(credentials)}`,
    postConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postUser = (user: IUserPostBody): Promise<Response> =>
  fetch(`${origin}/user`, postConfig(user)).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response
  })

export const sendToken = (email: string): Promise<Response> =>
  fetch(`${origin}/send-token`, postConfig({ user: email })).then(response => {
    if (!response.ok) {
      throw Error(String(response.status))
    }
    return response
  })
