import ICredentials from './types/ICredentials';

export const setCredentials = (credentials: ICredentials): void => {
  localStorage.setItem('credentials', JSON.stringify(credentials))
}
