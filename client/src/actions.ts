import { AnimationNameProperty } from "csstype";

interface IAction {
  payload: AnimationNameProperty
  type: string
}

const createAction = (type: string) => (payload?: any): IAction => ({payload, type})

export const AUTH_SIGN_IN_REQUEST = 'AUTH_SIGN_IN_REQUEST'
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS'

export const authSignInRequest = createAction(AUTH_SIGN_IN_REQUEST)
export const authSignInSuccess = createAction(AUTH_SIGN_IN_SUCCESS)
