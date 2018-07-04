import ICredentials from './types/ICredentials'

export const setCredentials = (credentials: ICredentials): void => {
  localStorage.setItem('credentials', JSON.stringify(credentials))
}

export const deleteCredentials = (): void => localStorage.clear()

export const getCredentials = (): Promise<ICredentials> => {
  const storedCredentials = localStorage.getItem('credentials')
  if (typeof storedCredentials === 'string') {
    try {
      return Promise.resolve(JSON.parse(storedCredentials))
    } catch (e) {
      // empty
    }
  }
  return Promise.reject(Error('credentials not found'))
}
