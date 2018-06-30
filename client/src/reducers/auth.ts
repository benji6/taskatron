import {
  AUTH_SIGN_IN_FAIL,
  AUTH_SIGN_IN_REQUEST,
  AUTH_SIGN_IN_SUCCESS,
  IAction,
  USER_SIGN_IN_UNMOUNT,
} from '../actions'

export interface IState {
  readonly failCode?: number
  readonly isLoggedIn: boolean
  readonly isRequestingSignIn: boolean
  readonly signInEmailSent: boolean
}

const initialState: IState = {
  isLoggedIn: false,
  isRequestingSignIn: false,
  signInEmailSent: false,
}

export default (
  state: IState = initialState,
  { payload, type }: IAction<any>,
): IState => {
  switch (type) {
    case AUTH_SIGN_IN_REQUEST:
      return { ...state, failCode: undefined, isRequestingSignIn: true }
    case AUTH_SIGN_IN_FAIL:
      return {
        ...state,
        failCode: payload,
        isRequestingSignIn: false,
      }
    case AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        failCode: undefined,
        isRequestingSignIn: false,
        signInEmailSent: true,
      }
    case USER_SIGN_IN_UNMOUNT:
      return {
        ...state,
        failCode: undefined,
      }
    default:
      return state
  }
}
