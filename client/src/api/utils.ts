import ICredentials from '../types/ICredentials'

export const origin = process.env.API_URL

const jsonHeaders = (credentials?: ICredentials): Headers => {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')

  if (credentials) {
    headers.append(
      'authorization',
      `Passwordless ${credentials.token} ${credentials.uid}`,
    )
  }

  return headers
}

export const deleteConfig = (credentials: ICredentials) => ({
  headers: jsonHeaders(credentials),
  method: 'DELETE',
})

export const getConfig = (credentials?: ICredentials) => ({
  headers: jsonHeaders(credentials),
})

export const patchConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders(credentials),
  method: 'PATCH',
})

export const postConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders(credentials),
  method: 'POST',
})

export const putConfig = (body: any, credentials?: ICredentials) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders(credentials),
  method: 'PUT',
})
