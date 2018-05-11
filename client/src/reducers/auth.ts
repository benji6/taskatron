import {
  AUTH_SIGN_IN_REQUEST,
  AUTH_SIGN_IN_SUCCESS,
  IAction,
} from '../actions';

export interface IState {
  readonly isLoggedIn: boolean
  readonly isRequestingSignIn: boolean
}

const initialState: IState = {
  isLoggedIn: false,
  isRequestingSignIn: false,
}

export default (state: IState = initialState, {payload, type}: IAction<any>): IState => {
  switch (type) {
    case AUTH_SIGN_IN_REQUEST:
      return {...state, isRequestingSignIn: true}
    case AUTH_SIGN_IN_SUCCESS:
      return {...state, isRequestingSignIn: false}
    default:
      return state
  }
}
