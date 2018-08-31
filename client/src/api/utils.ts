import ICredentials from '../types/ICredentials'

export const origin = 'http://localhost:3001'

export const credentialsQueryString = ({ token, uid }: ICredentials): string =>
  `token=${token}&uid=${encodeURIComponent(uid)}`

export const jsonHeaders = {
  'Content-Type': 'application/json',
}

export const deleteConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders,
  method: 'DELETE',
})

export const patchConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders,
  method: 'PATCH',
})

export const postConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders,
  method: 'POST',
})

export const putConfig = (body: any) => ({
  body: JSON.stringify(body),
  headers: jsonHeaders,
  method: 'PUT',
})
