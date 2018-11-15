import ICredentials from '../types/ICredentials'

export const origin = process.env.API_URL

const jsonHeaders = (
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

export const getConfig = (credentials?: ICredentials) => ({
  headers: jsonHeaders(credentials),
})

export const patchConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders(credentials, true),
  method: 'PATCH',
})

export const postConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders(credentials, true),
  method: 'POST',
})
