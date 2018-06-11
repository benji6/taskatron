import {all, call, put, takeLatest} from 'redux-saga/effects'
import {
  IAction,
  USER_CHECK_SIGNED_IN,
  USER_SIGN_OUT,
  USER_SIGN_UP_REQUEST,
  userGetSuccess,
  userSignUpFailure,
  userSignUpSuccess,
} from '../actions'
import {
  getMe,
  getSignOut,
  postUser,
} from '../api'
import {
  deleteCredentials,
  getCredentials,
} from '../localStorage';
import {IUserPostBody} from '../shared/types'

function* handleUserCheckSignedIn() {
  const credentials = getCredentials()
  if (!credentials) return
  try {
    const user = yield call(getMe, credentials);
    yield put(userGetSuccess(user))
  } catch (e) {
    deleteCredentials()
  }
}

function* handleUserSignOut() {
  try {
    yield call(getSignOut, getCredentials())
  } catch(e) {
    // empty
  } finally {
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
    takeLatest(USER_SIGN_OUT, handleUserSignOut),
    takeLatest(USER_SIGN_UP_REQUEST, handleUserSignUpRequest),
  ])
}
