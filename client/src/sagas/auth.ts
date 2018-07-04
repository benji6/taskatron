import { call, put, takeLatest } from 'redux-saga/effects'
import {
  authSignInFail,
  authSignInRequest,
  authSignInSuccess,
} from '../actions'
import { sendToken } from '../api'
import IAction from '../types/IAction'

function* handleAuthSignInRequest({ payload }: IAction<string>) {
  try {
    yield call(sendToken, payload)
    yield put(authSignInSuccess())
  } catch (e) {
    yield put(authSignInFail(Number(e.message)))
  }
}

export default function* watchAuthSignInRequest() {
  yield takeLatest(authSignInRequest, handleAuthSignInRequest)
}
