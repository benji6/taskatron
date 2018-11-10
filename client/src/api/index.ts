import { getCredentials } from '../localStorage'
import {
  IServiceDocument,
  IServicePostBody,
  IUserPatchBody,
  IUserPostBody,
  IUserResponse,
} from '../shared/types'
import ICredentials from '../types/ICredentials'
import {
  deleteConfig,
  getConfig,
  origin,
  patchConfig,
  postConfig,
  putConfig,
} from './utils'

export const deleteCleaningService = async (id: string): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service/${id}`,
    deleteConfig(credentials),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const getMe = (
  credentialsPromise: Promise<ICredentials>,
): Promise<IUserResponse> =>
  credentialsPromise
    .then(credentials => fetch(`${origin}/me`, getConfig(credentials)))
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
    .then(credentials => fetch(`${origin}/sign-out`, getConfig(credentials)))
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const patchMe = async (body: IUserPatchBody): Promise<Response> => {
  const credentials = await getCredentials()

  const response = await fetch(`${origin}/me`, patchConfig(body, credentials))
  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postService = async (
  service: IServicePostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service`,
    postConfig(service, credentials),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postUser = (user: IUserPostBody): Promise<Response> =>
  fetch(`${origin}/user`, postConfig(user)).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response
  })

export const putService = async (
  service: IServiceDocument,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service/${service._id}`,
    putConfig(service, credentials),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const sendToken = (email: string): Promise<Response> =>
  fetch(`${origin}/send-token`, postConfig({ user: email })).then(response => {
    if (!response.ok) {
      throw Error(String(response.status))
    }
    return response
  })
