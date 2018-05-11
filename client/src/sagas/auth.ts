import {call, put, takeLatest} from 'redux-saga/effects'
import {
  AUTH_SIGN_IN_REQUEST,
  authSignInSuccess,
  IAction,
} from '../actions'
import {authSignIn} from '../api'

function* handleAuthSignInRequest({payload}: IAction<string>) {
  yield call(authSignIn, payload)
  yield put(authSignInSuccess())
}

export default function* watchAuthSignInRequest() {
  yield takeLatest(AUTH_SIGN_IN_REQUEST, handleAuthSignInRequest)
}
