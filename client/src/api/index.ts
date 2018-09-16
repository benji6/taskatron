import { getCredentials } from '../localStorage'
import { CLEANING, GARDENING, IRONING } from '../shared/services'
import {
  ICleaningPostBody,
  ICleaningSearchParams,
  ICleaningServiceSearchResponse,
  IGardeningServiceSearchResponse,
  IIroningServiceSearchResponse,
  IServiceCleaningDocument,
  IServiceDocument,
  IServiceGardeningDocument,
  IServiceGardeningPostBody,
  IServiceIroningDocument,
  IServiceIroningPostBody,
  IUserDocument,
  IUserPatchBody,
  IUserPostBody,
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
    `${origin}/services/${CLEANING}/${id}?${credentialsQueryString(
      credentials,
    )}`,
    deleteConfig(),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const deleteGardeningService = async (id: string): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/services/${GARDENING}/${id}?${credentialsQueryString(
      credentials,
    )}`,
    deleteConfig(),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const deleteIroningService = async (id: string): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/services/${IRONING}/${id}?${credentialsQueryString(
      credentials,
    )}`,
    deleteConfig(),
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

export const getCleaningServices = async (
  searchParams: ICleaningSearchParams,
): Promise<ICleaningServiceSearchResponse> => {
  const response = await fetch(
    `${origin}/services/${CLEANING}${createSearchString(searchParams)}`,
  )
  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getGardeningServices = async ({
  limit,
  skip,
}: {
  limit: number
  skip: number
}): Promise<IGardeningServiceSearchResponse> => {
  const response = await fetch(
    `${origin}/services/${GARDENING}?limit=${limit}&skip=${skip}`,
  )
  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getIroningServices = async ({
  limit,
  skip,
}: {
  limit: number
  skip: number
}): Promise<IIroningServiceSearchResponse> => {
  const response = await fetch(
    `${origin}/services/${IRONING}?limit=${limit}&skip=${skip}`,
  )
  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getUserServices = async (): Promise<IServiceDocument[]> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/user/${credentials.uid}/services?${credentialsQueryString(
      credentials,
    )}`,
  )

  if (!response.ok) throw Error(String(response.status))
  return response.json()
}

export const getCleaningService = async (): Promise<
  IServiceCleaningDocument | undefined
> => {
  const services = await getUserServices()

  const service = services.find(({ serviceType }) => serviceType === CLEANING)

  if (service) {
    const { serviceType, ...actualService } = service
    return actualService as IServiceCleaningDocument
  }

  return service
}

export const getGardeningService = async (): Promise<
  IServiceGardeningDocument | undefined
> => {
  const services = await getUserServices()

  return services.find(({ serviceType }) => serviceType === GARDENING) as
    | IServiceGardeningDocument
    | undefined
}

export const getIroningService = async (): Promise<
  IServiceIroningDocument | undefined
> => {
  const services = await getUserServices()

  return services.find(({ serviceType }) => serviceType === IRONING) as
    | IServiceIroningDocument
    | undefined
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

export const postCleaningService = async (
  service: ICleaningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/services/${CLEANING}?${credentialsQueryString(credentials)}`,
    postConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postGardeningService = async (
  service: IServiceGardeningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/services/${GARDENING}?${credentialsQueryString(credentials)}`,
    postConfig(service),
  )

  if (!response.ok) throw Error(String(response.status))
  return response
}

export const postIroningService = async (
  service: IServiceIroningPostBody,
): Promise<Response> => {
  const credentials = await getCredentials()
  const response = await fetch(
    `${origin}/services/${IRONING}?${credentialsQueryString(credentials)}`,
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
    `${origin}/services/${CLEANING}/${service._id}?${credentialsQueryString(
      credentials,
    )}`,
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
    `${origin}/services/${GARDENING}/${service._id}?${credentialsQueryString(
      credentials,
    )}`,
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
    `${origin}/services/${IRONING}/${service._id}?${credentialsQueryString(
      credentials,
    )}`,
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
