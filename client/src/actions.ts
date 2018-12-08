import { createAction } from 'redux-actions'

export const userGetCredentialsFailure = createAction(
  'USER_GET_CREDENTIALS_FAILURE',
)
export const userGetFailure = createAction('USER_GET_FAILURE')
export const userGetSuccess = createAction('USER_GET_SUCCESS')
export const userLogInFail = createAction('USER_LOG_IN_FAIL')
export const userSet = createAction('USER_SET')
export const userSignOut = createAction('USER_SIGN_OUT')
