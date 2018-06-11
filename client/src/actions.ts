export interface IAction<T> {
  payload?: T
  type: string
}

const createAction = (type: string) => <T>(payload?: T): IAction<T> => ({payload, type})
const createActionWithoutPayload = (type: string) => (): IAction<undefined> => ({type})

export const AUTH_SIGN_IN_REQUEST = 'AUTH_SIGN_IN_REQUEST'
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS'
export const USER_CHECK_SIGNED_IN = 'USER_CHECK_SIGNED_IN'
export const USER_GET_SUCCESS = 'USER_GET_SUCCESS'
export const USER_SIGN_OUT = 'USER_SIGN_OUT'
export const USER_SIGN_UP_FAILURE = 'USER_SIGN_UP_FAILURE'
export const USER_SIGN_UP_REQUEST = 'USER_SIGN_UP_REQUEST'
export const USER_SIGN_UP_SUCCESS = 'USER_SIGN_UP_SUCCESS'

export const authSignInRequest = createAction(AUTH_SIGN_IN_REQUEST)
export const authSignInSuccess = createAction(AUTH_SIGN_IN_SUCCESS)
export const userCheckSignedIn = createAction(USER_CHECK_SIGNED_IN)
export const userGetSuccess = createAction(USER_GET_SUCCESS)
export const userSignOut = createActionWithoutPayload(USER_SIGN_OUT)
export const userSignUpFailure = createAction(USER_SIGN_UP_FAILURE)
export const userSignUpRequest = createAction(USER_SIGN_UP_REQUEST)
export const userSignUpSuccess = createAction(USER_SIGN_UP_SUCCESS)
