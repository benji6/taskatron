import {
  IAction,
  USER_SIGN_UP_SUCCESS,
} from '../actions';

export interface IState {
  readonly hasSignedUp: boolean
}

const initialState = {
  hasSignedUp: false,
}

export default (state: IState = initialState, {payload, type}: IAction<any>): IState => {
  switch (type) {
    case USER_SIGN_UP_SUCCESS:
      return {...state, hasSignedUp: true}
    default:
      return state
  }
}
