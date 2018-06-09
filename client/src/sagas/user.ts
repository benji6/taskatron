import {call, put, takeLatest} from 'redux-saga/effects'
import {
  IAction,
  USER_SIGN_UP_REQUEST,
  userSignUpFailure,
  userSignUpSuccess,
} from '../actions'
import {postUser} from '../api'
import {IUserPostBody} from '../shared/types'

function* handleUserSignUpRequest({payload}: IAction<IUserPostBody>) {
  try {
    yield call(postUser, payload)
    yield put(userSignUpSuccess())
  } catch (e) {
    yield put(userSignUpFailure())
  }
}

export default function* watchSignUpRequest() {
  yield takeLatest(USER_SIGN_UP_REQUEST, handleUserSignUpRequest)
}
