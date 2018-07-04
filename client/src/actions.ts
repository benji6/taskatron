import { createAction } from 'redux-actions'

export const authSignInFail = createAction('AUTH_SIGN_IN_FAIL')
export const authSignInRequest = createAction('AUTH_SIGN_IN_REQUEST')
export const authSignInSuccess = createAction('AUTH_SIGN_IN_SUCCESS')
export const userAuth = createAction('USER_AUTH')
export const userGetCredentialsFailure = createAction(
  'USER_GET_CREDENTIALS_FAILURE',
)
export const userGetFailure = createAction('USER_GET_FAILURE')
export const userGetSuccess = createAction('USER_GET_SUCCESS')
export const userLogInFail = createAction('USER_LOG_IN_FAIL')
export const userSignInUnmount = createAction('USER_SIGN_IN_UNMOUNT')
export const userSignOut = createAction('USER_SIGN_OUT')
export const userSignUpFailure = createAction('USER_SIGN_UP_FAILURE')
export const userSignUpRequest = createAction('USER_SIGN_UP_REQUEST')
export const userSignUpSuccess = createAction('USER_SIGN_UP_SUCCESS')
