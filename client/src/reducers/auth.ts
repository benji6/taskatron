import {
  authSignInFail,
  authSignInRequest,
  authSignInSuccess,
  userSignInUnmount,
} from '../actions'
import IAction from '../types/IAction'

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
    case String(authSignInRequest):
      return { ...state, failCode: undefined, isRequestingSignIn: true }
    case String(authSignInFail):
      return {
        ...state,
        failCode: payload,
        isRequestingSignIn: false,
      }
    case String(authSignInSuccess):
      return {
        ...state,
        failCode: undefined,
        isRequestingSignIn: false,
        signInEmailSent: true,
      }
    case String(userSignInUnmount):
      return {
        ...state,
        failCode: undefined,
      }
    default:
      return state
  }
}
