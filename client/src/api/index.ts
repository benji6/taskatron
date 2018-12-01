import { IUserPatchBody, IUserPostBody, IUserResponse } from 'shared/types'
import { getCredentials } from '../localStorage'
import ICredentials from '../types/ICredentials'
import { getConfig, origin, patchConfig, postConfig } from './utils'

export const getMe = (credentials: ICredentials): Promise<IUserResponse> =>
  fetch(`${origin}/me`, getConfig(credentials))
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const getSignOut = (
  credentials: ICredentials | undefined,
): Promise<Response> =>
  fetch(`${origin}/sign-out`, getConfig(credentials))
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const patchMe = async (body: IUserPatchBody): Promise<Response> => {
  const response = await fetch(
    `${origin}/me`,
    patchConfig(body, getCredentials()),
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
