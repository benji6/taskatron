import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  IAction,
  USER_AUTH,
  USER_SIGN_OUT,
  USER_SIGN_UP_REQUEST,
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userSignUpFailure,
  userSignUpSuccess,
  userLogInFail,
} from '../actions'
import { getMe, getSignOut, postUser } from '../api'
import {
  deleteCredentials,
  getCredentials,
  setCredentials,
} from '../localStorage'
import { IUserPostBody } from '../shared/types'

function* handleUserCheckSignedIn() {
  const credentials = getCredentials()
  const params = new URL(String(document.location)).searchParams
  const token = params.get('token')
  const uid = params.get('uid')

  if (credentials) {
    try {
      const user = yield call(getMe, credentials)
      yield put(userGetSuccess(user))
    } catch (e) {
      if (location.pathname === '/login') {
        if (token && uid) {
          const credentials = { token, uid }
          try {
            const user = yield call(getMe, credentials)
            yield put(userGetSuccess(user))
            setCredentials(credentials)
          } catch (e) {
            yield put(userLogInFail())
          }
        }
        return
      }
      yield put(userGetFailure())
      deleteCredentials()
    }
    return
  }

  if (location.pathname === '/login') {
    if (token && uid) {
      const credentials = { token, uid }
      try {
        const user = yield call(getMe, credentials)
        yield put(userGetSuccess(user))
        setCredentials(credentials)
      } catch (e) {
        yield put(userLogInFail())
      }
    }
    return
  }

  yield put(userGetCredentialsFailure())
}

function* handleUserSignOut() {
  try {
    yield call(getSignOut, getCredentials())
  } catch (e) {
    // empty
  } finally {
    deleteCredentials()
  }
}

function* handleUserSignUpRequest({ payload }: IAction<IUserPostBody>) {
  try {
    yield call(postUser, payload)
    yield put(userSignUpSuccess())
  } catch (e) {
    yield put(userSignUpFailure())
  }
}

export default function* watchSignUpRequest() {
  yield all([
    takeLatest(USER_AUTH, handleUserCheckSignedIn),
    takeLatest(USER_SIGN_OUT, handleUserSignOut),
    takeLatest(USER_SIGN_UP_REQUEST, handleUserSignUpRequest),
  ])
}
