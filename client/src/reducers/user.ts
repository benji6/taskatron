import {
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
  userSignOut,
} from '../actions'
import IAction from '../types/IAction'

export interface IState {
  _id?: string
  email?: string
  firstName?: string
  isLoading: boolean
  lastName?: string
  postcode?: string
  logInFail: boolean
}

const initialState = {
  isLoading: true,
  logInFail: false,
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
    default:
      return state
  }
}
