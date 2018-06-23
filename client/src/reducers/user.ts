import {
  IAction,
  USER_GET_CREDENTIALS_FAILURE,
  USER_GET_FAILURE,
  USER_GET_SUCCESS,
  USER_LOG_IN_FAIL,
  USER_SIGN_OUT,
  USER_SIGN_UP_FAILURE,
  USER_SIGN_UP_SUCCESS,
} from '../actions'

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
    case USER_GET_CREDENTIALS_FAILURE:
    case USER_GET_FAILURE:
      return { ...state, isLoading: false }
    case USER_GET_SUCCESS:
      return { ...state, ...payload, isLoading: false }
    case USER_LOG_IN_FAIL:
      return { ...state, isLoading: false, logInFail: true }
    case USER_SIGN_OUT:
      return { ...initialState, isLoading: false }
    case USER_SIGN_UP_FAILURE:
      return { ...state, signUpFailure: true }
    case USER_SIGN_UP_SUCCESS:
      return { ...state, hasSignedUp: true }
    default:
      return state
  }
}
