import { call, put, takeLatest } from 'redux-saga/effects'
import { AUTH_SIGN_IN_REQUEST, authSignInSuccess, IAction } from '../actions'
import { sendToken } from '../api'

function* handleAuthSignInRequest({ payload }: IAction<string>) {
  try {
    yield call(sendToken, payload)
    yield put(authSignInSuccess())
  } catch (e) {
    // TODO
  }
}

export default function* watchAuthSignInRequest() {
  yield takeLatest(AUTH_SIGN_IN_REQUEST, handleAuthSignInRequest)
}
