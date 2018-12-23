import { getCredentials } from '../localStorage'
import ICredentials from '../types/ICredentials'

export const origin = process.env.API_URL

const createHeaders = (
  credentials?: ICredentials,
  withContentType?: boolean,
): Headers => {
  const headers = new Headers()

  if (withContentType) headers.append('Content-Type', 'application/json')

  if (credentials) {
    headers.append(
      'authorization',
      `Passwordless ${credentials.token} ${credentials.uid}`,
    )
  }

  return headers
}

export const deleteConfig = () => ({
  headers: createHeaders(getCredentials()),
  method: 'DELETE',
})

export const getConfig = (credentials?: ICredentials) => ({
  headers: createHeaders(credentials),
})

export const postConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: createHeaders(credentials, true),
  method: 'POST',
})

export const postFileConfig = (body: File) => ({
  body,
  headers: createHeaders(getCredentials()),
  method: 'POST',
})

export const putFileConfig = (body: File) => ({
  body,
  headers: createHeaders(getCredentials()),
  method: 'PUT',
})
