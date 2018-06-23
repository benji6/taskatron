import IStore from './types/IStore'

export const hasSignedUpSelector = (state: IStore): boolean =>
  state.user.hasSignedUp
export const isRequestingSignInSelector = (state: IStore): boolean =>
  state.auth.isRequestingSignIn
export const signInEmailSentSelector = (state: IStore): boolean =>
  state.auth.signInEmailSent
export const signUpFailureSelector = (state: IStore): boolean =>
  state.user.signUpFailure
export const userEmailSelector = (state: IStore): string | undefined =>
  state.user.email
export const userIsLoadingSelector = (state: IStore): boolean =>
  state.user.isLoading
export const userIsSignedInSelector = (state: IStore): boolean =>
  Boolean(state.user.email)
export const userLogInFailSelector = (state: IStore): boolean =>
  state.user.logInFail
