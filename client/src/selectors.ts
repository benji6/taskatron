import IStore from './types/IStore'

export const userEmailSelector = (state: IStore): string | undefined =>
  state.user.email
export const userFirstNameSelector = (state: IStore): string | undefined =>
  state.user.firstName
export const userIdSelector = (state: IStore): string | undefined =>
  state.user._id
export const userIsLoadingSelector = (state: IStore): boolean =>
  state.user.isLoading
export const userIsSignedInSelector = (state: IStore): boolean =>
  Boolean(state.user.email)
export const userLastNameSelector = (state: IStore): string | undefined =>
  state.user.lastName
export const userLogInFailSelector = (state: IStore): boolean =>
  state.user.logInFail
export const userPostcodeSelector = (state: IStore): string | undefined =>
  state.user.postcode
