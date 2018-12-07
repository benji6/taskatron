import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  userAuth,
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
} from '../actions'
import { getMe } from '../api'
import {
  deleteCredentials,
  getCredentials,
  setCredentials,
} from '../localStorage'

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
          const paramsCredentials = { token, uid }
          try {
            const user = yield call(getMe, paramsCredentials)
            yield put(userGetSuccess(user))
            setCredentials(paramsCredentials)
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
      const paramsCredentials = { token, uid }
      try {
        const user = yield call(getMe, paramsCredentials)
        yield put(userGetSuccess(user))
        setCredentials(paramsCredentials)
      } catch (e) {
        yield put(userLogInFail())
      }
    }
    return
  }

  yield put(userGetCredentialsFailure())
}

export default function* watchSignUpRequest() {
  yield all([takeLatest(userAuth, handleUserCheckSignedIn)])
}
