import {put, takeLatest} from 'redux-saga/effects'
import {
  AUTH_SIGN_IN_REQUEST,
  authSignInSuccess,
} from '../actions'

function* handleAuthSignInRequest() {
  yield put(authSignInSuccess())
}

export default function* watchAuthSignInRequest() {
  yield takeLatest(AUTH_SIGN_IN_REQUEST, handleAuthSignInRequest)
}
