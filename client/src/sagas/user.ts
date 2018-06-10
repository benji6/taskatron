import {all, call, put, takeLatest} from 'redux-saga/effects'
import {
  IAction,
  USER_CHECK_SIGNED_IN,
  USER_SIGN_UP_REQUEST,
  userGetSuccess,
  userSignUpFailure,
  userSignUpSuccess,
} from '../actions'
import {getMe, postUser} from '../api'
import {
  deleteCredentials,
  getCredentials,
} from '../localStorage';
import {IUserPostBody} from '../shared/types'

function* handleUserCheckSignedIn() {
  const credentials = getCredentials()
  if (!credentials) return
  try {
    const user = yield call(getMe, getCredentials());
    yield put(userGetSuccess(user))
  } catch (e) {
    deleteCredentials()
  }
}

function* handleUserSignUpRequest({payload}: IAction<IUserPostBody>) {
  try {
    yield call(postUser, payload)
    yield put(userSignUpSuccess())
  } catch (e) {
    yield put(userSignUpFailure())
  }
}

export default function* watchSignUpRequest() {
  yield all([
    takeLatest(USER_CHECK_SIGNED_IN, handleUserCheckSignedIn),
    takeLatest(USER_SIGN_UP_REQUEST, handleUserSignUpRequest),
  ])
}
