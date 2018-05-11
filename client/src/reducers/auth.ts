import {
  AUTH_SIGN_IN_REQUEST,
  AUTH_SIGN_IN_SUCCESS,
  IAction,
} from '../actions';

export interface IState {
  readonly isLoggedIn: boolean
  readonly isRequestingSignIn: boolean
  readonly signInEmailSent: boolean
}

const initialState: IState = {
  isLoggedIn: false,
  isRequestingSignIn: false,
  signInEmailSent: false,
}

export default (state: IState = initialState, {payload, type}: IAction<any>): IState => {
  switch (type) {
    case AUTH_SIGN_IN_REQUEST:
      return {...state, isRequestingSignIn: true}
    case AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        isRequestingSignIn: false,
        signInEmailSent: true,
      }
    default:
      return state
  }
}
