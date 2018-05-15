export interface IAction<T> {
  payload?: T
  type: string
}

const createAction = (type: string) => <T>(payload?: T): IAction<T> => ({payload, type})

export const AUTH_SIGN_IN_REQUEST = 'AUTH_SIGN_IN_REQUEST'
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS'
export const USER_SIGN_UP_REQUEST = 'USER_SIGN_UP_REQUEST'

export const authSignInRequest = createAction(AUTH_SIGN_IN_REQUEST)
export const authSignInSuccess = createAction(AUTH_SIGN_IN_SUCCESS)
export const userSignUpRequest = createAction(USER_SIGN_UP_REQUEST)
