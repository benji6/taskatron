import {
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
  userSignOut,
  userSignUpFailure,
  userSignUpRequest,
} from '../actions'
import IAction from '../types/IAction'

export interface IState {
  readonly _id?: string
  readonly email?: string
  readonly firstName?: string
  readonly hasSignedUp: boolean
  readonly isLoading: boolean
  readonly lastName?: string
  readonly logInFail: boolean
  readonly signUpFailure: boolean
}

const initialState = {
  hasSignedUp: false,
  isLoading: true,
  logInFail: false,
  signUpFailure: false,
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
      return { ...state, signUpFailure: true }
    case String(userSignUpRequest):
      return { ...state, hasSignedUp: true }
    default:
      return state
  }
}
