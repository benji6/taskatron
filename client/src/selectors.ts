import IStore from './types/IStore';

export const hasSignedUpSelector = (state: IStore): boolean => state.user.hasSignedUp
export const isLoggedInSelector = (state: IStore): boolean => state.auth.isLoggedIn
export const isRequestingSignInSelector = (state: IStore): boolean => state.auth.isRequestingSignIn
export const signInEmailSentSelector = (state: IStore): boolean => state.auth.signInEmailSent
