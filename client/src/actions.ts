export interface IAction<T> {
  payload?: T
  type: string
}

const createAction = (type: string) => <T>(payload: T): IAction<T> => ({
  payload,
  type,
})
const createActionWithoutPayload = (type: string) => (): IAction<
  undefined
> => ({ type })

export const AUTH_SIGN_IN_FAIL = 'AUTH_SIGN_IN_FAIL'
export const AUTH_SIGN_IN_REQUEST = 'AUTH_SIGN_IN_REQUEST'
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS'
export const USER_AUTH = 'USER_AUTH'
export const USER_GET_CREDENTIALS_FAILURE = 'USER_GET_CREDENTIALS_FAILURE'
export const USER_GET_FAILURE = 'USER_GET_FAILURE'
export const USER_GET_SUCCESS = 'USER_GET_SUCCESS'
export const USER_LOG_IN_FAIL = 'USER_LOGIN_FAIL'
export const USER_SIGN_IN_UNMOUNT = 'USER_SIGN_IN_UNMOUNT'
export const USER_SIGN_OUT = 'USER_SIGN_OUT'
export const USER_SIGN_UP_FAILURE = 'USER_SIGN_UP_FAILURE'
export const USER_SIGN_UP_REQUEST = 'USER_SIGN_UP_REQUEST'
export const USER_SIGN_UP_SUCCESS = 'USER_SIGN_UP_SUCCESS'

export const authSignInRequest = createAction(AUTH_SIGN_IN_REQUEST)
export const authSignInFail = createAction(AUTH_SIGN_IN_FAIL)
export const authSignInSuccess = createActionWithoutPayload(
  AUTH_SIGN_IN_SUCCESS,
)
export const userAuth = createActionWithoutPayload(USER_AUTH)
export const userGetCredentialsFailure = createActionWithoutPayload(
  USER_GET_CREDENTIALS_FAILURE,
)
export const userLogInFail = createActionWithoutPayload(USER_LOG_IN_FAIL)
export const userGetFailure = createActionWithoutPayload(USER_GET_FAILURE)
export const userGetSuccess = createAction(USER_GET_SUCCESS)
export const userSignInUnmount = createActionWithoutPayload(
  USER_SIGN_IN_UNMOUNT,
)
export const userSignOut = createActionWithoutPayload(USER_SIGN_OUT)
export const userSignUpFailure = createActionWithoutPayload(
  USER_SIGN_UP_FAILURE,
)
export const userSignUpRequest = createAction(USER_SIGN_UP_REQUEST)
export const userSignUpSuccess = createActionWithoutPayload(
  USER_SIGN_UP_SUCCESS,
)
