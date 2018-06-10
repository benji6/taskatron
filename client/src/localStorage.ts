import ICredentials from './types/ICredentials';

export const setCredentials = (credentials: ICredentials): void => {
  localStorage.setItem('credentials', JSON.stringify(credentials))
}

export const deleteCredentials = (): void => localStorage.clear()

export const getCredentials = (): ICredentials | void => {
  const storedCredentials = localStorage.getItem('credentials')
  if (typeof storedCredentials === 'string') {
    try {
      return JSON.parse(storedCredentials)
    } catch (e) {
      // empty
    }
  }
}
