import { getCredentials } from '../localStorage'
import { CLEANING, GARDENING, IRONING } from '../shared/services'
import {
  IServiceCleaningDocument,
  IServiceCleaningPostBody,
  IServiceDocument,
  IServiceGardeningDocument,
  IServiceGardeningPostBody,
  IServiceIroningDocument,
  IServiceIroningPostBody,
  IServiceResponseObject,
  IUserDocument,
  IUserPatchBody,
  IUserPostBody,
  TService,
} from '../shared/types'
import ICredentials from '../types/ICredentials'
import {
  credentialsQueryString,
  deleteConfig,
  origin,
  patchConfig,
  postConfig,
  putConfig,
} from './utils'

export const deleteService = async (id: string): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services?${credentialsQueryString(credentials)}`,
    deleteConfig({ _id: id }),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const getMe = (
  credentialsPromise: Promise<ICredentials>,
): Promise<IUserDocument> =>
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

export const getServices = async ({
  serviceType,
}: {
  serviceType: TService
}): Promise<IServiceResponseObject[]> => {
  const response = await fetch(`${origin}/services?serviceType=${serviceType}`)
  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getUserServices = async (): Promise<IServiceDocument[]> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services?${credentialsQueryString(credentials)}`,
  )

  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getCleaningService = async (): Promise<
  IServiceCleaningDocument | undefined
> => {
  const services = await getUserServices()

  return (services as IServiceCleaningDocument[]).find(
    ({ service }) => service === CLEANING,
  )
}

export const getGardeningService = async (): Promise<
  IServiceGardeningDocument | undefined
> => {
  const services = await getUserServices()

  return (services as IServiceGardeningDocument[]).find(
    ({ service }) => service === GARDENING,
  )
}

export const getIroningService = async (): Promise<
  IServiceIroningDocument | undefined
> => {
  const services = await getUserServices()

  return (services as IServiceIroningDocument[]).find(
    ({ service }) => service === IRONING,
  )
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

export const postServiceCleaning = async (
  service: IServiceCleaningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/cleaning?${credentialsQueryString(credentials)}`,
    postConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postServiceGardening = async (
  service: IServiceGardeningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/gardening?${credentialsQueryString(credentials)}`,
    postConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postServiceIroning = async (
  service: IServiceIroningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/ironing?${credentialsQueryString(credentials)}`,
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

export const putServiceCleaning = async (
  service: IServiceCleaningDocument,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/cleaning?${credentialsQueryString(credentials)}`,
    putConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const putServiceGardening = async (
  service: IServiceGardeningDocument,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/gardening?${credentialsQueryString(credentials)}`,
    putConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const putServiceIroning = async (
  service: IServiceIroningDocument,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/me/services/ironing?${credentialsQueryString(credentials)}`,
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
