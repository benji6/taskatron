import { IUserPatchBody, IUserPostBody, IUserResponse } from 'shared/types'
import compactor from '../compactor'
import { getCredentials } from '../localStorage'
import ICredentials from '../types/ICredentials'
import {
  deleteConfig,
  getConfig,
  origin,
  patchConfig,
  postConfig,
  postFileConfig,
  putFileConfig,
} from './utils'

export const deleteServiceImage = (id: string): Promise<Response> =>
  fetch(`${origin}/services/${id}/image`, deleteConfig()).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response
  })

export const getMe = (credentials: ICredentials): Promise<IUserResponse> =>
  fetch(`${origin}/me`, getConfig(credentials))
    .then(response => {
      if (!response.ok) {
        throw Error(String(response.status))
      }
      return response
    })
    .then(response => response.json())

export const getSignOut = (): Promise<Response> =>
  fetch(`${origin}/sign-out`, getConfig(getCredentials()))
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

const getFormatFromExtension = (extension: string) =>
  extension === 'png' ? 'png' : extension === 'webp' ? 'webp' : 'jpg'

export const postServiceImage = async ({
  extension,
  id,
  image,
}: {
  extension: string
  id: string
  image: File
}): Promise<{ imagePath: string }> => {
  const compressedImage = await compactor({
    file: image,
    format: getFormatFromExtension(extension),
    maxHeight: 512,
    maxWidth: 512,
    quality: 0.9,
  })
  return fetch(
    `${origin}/services/${id}/image/${extension}`,
    postFileConfig(compressedImage),
  ).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response.json()
  })
}

export const postUser = (user: IUserPostBody): Promise<Response> =>
  fetch(`${origin}/user`, postConfig(user)).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response
  })

export const putServiceImage = async ({
  extension,
  id,
  image,
}: {
  extension: string
  id: string
  image: File
}): Promise<{ imagePath: string }> => {
  const compressedImage = await compactor({
    file: image,
    format: getFormatFromExtension(extension),
    maxHeight: 512,
    maxWidth: 512,
    quality: 0.9,
  })
  return fetch(
    `${origin}/services/${id}/image/${extension}`,
    putFileConfig(compressedImage),
  ).then(response => {
    if (!response.ok) throw Error(String(response.status))
    return response.json()
  })
}

export const sendToken = (email: string): Promise<Response> =>
  fetch(`${origin}/send-token`, postConfig({ user: email })).then(response => {
    if (!response.ok) {
      throw Error(String(response.status))
    }
    return response
  })
