import {call, put, takeLatest} from 'redux-saga/effects'
import {
  IAction,
  USER_SIGN_UP_REQUEST,
  userSignUpSuccess,
} from '../actions'
import {signUp} from '../api'
import ISignUpBody from '../types/ISignUpBody'

function* handleUserSignUpRequest({payload}: IAction<ISignUpBody>) {
  try {
    yield call(signUp, payload)
    yield put(userSignUpSuccess())
  } catch (e) {
    // TODO
  }
}

export default function* watchSignUpRequest() {
  yield takeLatest(USER_SIGN_UP_REQUEST, handleUserSignUpRequest)
}
