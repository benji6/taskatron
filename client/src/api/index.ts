import { getCredentials } from '../localStorage'
import {
  IServiceDocument,
  IServicePostBody,
  IServiceSearchParams,
  IServiceSearchResponse,
  IUserPatchBody,
  IUserPostBody,
  IUserResponse,
} from '../shared/types'
import ICredentials from '../types/ICredentials'
import { createSearchString } from '../utils'
import {
  credentialsQueryString,
  deleteConfig,
  origin,
  patchConfig,
  postConfig,
  putConfig,
} from './utils'

export const deleteCleaningService = async (id: string): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service/${id}?${credentialsQueryString(credentials)}`,
    deleteConfig(),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const getMe = (
  credentialsPromise: Promise<ICredentials>,
): Promise<IUserResponse> =>
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

export const getCleaningServices = async (
  searchParams: IServiceSearchParams,
): Promise<IServiceSearchResponse> => {
  const response = await fetch(
    `${origin}/service${createSearchString(searchParams)}`,
  )
  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getUserService = async (): Promise<
  IServiceDocument | undefined
> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/user/${credentials.uid}/service?${credentialsQueryString(
      credentials,
    )}`,
  )

  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

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

export const patchMe = async (body: IUserPatchBody): Promise<Response> => {
  const credentials = await getCredentials()

  const response = await fetch(
    `${origin}/me?${credentialsQueryString(credentials)}`,
    patchConfig(body),
  )
  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postService = async (
  service: IServicePostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service?${credentialsQueryString(credentials)}`,
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

export const putService = async (
  service: IServiceDocument,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/service/${service._id}?${credentialsQueryString(credentials)}`,
    putConfig(service),
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
