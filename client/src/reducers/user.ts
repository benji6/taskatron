import {
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
  userSignOut,
  userSignUpFailure,
  userSignUpRequest,
  userSignUpUnmount,
} from '../actions'
import IAction from '../types/IAction'

export interface IState {
  _id?: string
  email?: string
  firstName?: string
  hasSignedUp: boolean
  isLoading: boolean
  lastName?: string
  logInFail: boolean
  signUpFailureCode?: 400 | 500
}

const initialState = {
  hasSignedUp: false,
  isLoading: true,
  logInFail: false,
  signUpFailureCode: undefined,
}

export default (
  state: IState = initialState,
  { payload, type }: IAction<any>,
): IState => {
  switch (type) {
    case String(userGetCredentialsFailure):
    case String(userGetFailure):
      return { ...state, isLoading: false }
    case String(userGetSuccess):
      return { ...state, ...payload, isLoading: false }
    case String(userLogInFail):
      return { ...state, isLoading: false, logInFail: true }
    case String(userSignOut):
      return { ...initialState, isLoading: false }
    case String(userSignUpFailure):
      return { ...state, signUpFailureCode: payload }
    case String(userSignUpRequest):
      return { ...state, hasSignedUp: true }
    case String(userSignUpUnmount):
      return {
        ...state,
        hasSignedUp: false,
        logInFail: false,
        signUpFailureCode: undefined,
      }
    default:
      return state
  }
}
