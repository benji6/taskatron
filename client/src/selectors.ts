import IStore from './types/IStore'

export const userIsLoadingSelector = (state: IStore): boolean =>
  state.user.isLoading
export const userIsSignedInSelector = (state: IStore): boolean =>
  Boolean(state.user.email)
export const userLogInFailSelector = (state: IStore): boolean =>
  state.user.logInFail
