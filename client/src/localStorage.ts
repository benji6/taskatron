import ICredentials from './types/ICredentials'

export const deleteCredentials = (): void => localStorage.clear()

export const getCredentials = (): ICredentials | undefined => {
  const storedCredentials = localStorage.getItem('credentials')
  if (typeof storedCredentials === 'string') {
    try {
      return JSON.parse(storedCredentials)
    } catch (e) {
      deleteCredentials()
      return undefined
    }
  }
  return undefined
}

export const getUserId = (): string | undefined => {
  const credentials = getCredentials()
  return credentials ? credentials.uid : undefined
}

export const setCredentials = (credentials: ICredentials): void => {
  localStorage.setItem('credentials', JSON.stringify(credentials))
}
