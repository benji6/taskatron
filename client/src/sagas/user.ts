import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  userAuth,
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
  userSignOut,
  userSignUpFailure,
  userSignUpRequest,
  userSignUpSuccess,
} from '../actions'
import { getMe, getSignOut, postUser } from '../api'
import {
  deleteCredentials,
  getCredentials,
  setCredentials,
} from '../localStorage'
import { IUserPostBody } from '../shared/types'
import IAction from '../types/IAction'

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
            const user = yield call(getMe, Promise.resolve(paramsCredentials))
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
        const user = yield call(getMe, Promise.resolve(paramsCredentials))
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
    yield put(userSignUpFailure(Number(e.message)))
  }
}

export default function* watchSignUpRequest() {
  yield all([
    takeLatest(userAuth, handleUserCheckSignedIn),
    takeLatest(userSignOut, handleUserSignOut),
    takeLatest(userSignUpRequest, handleUserSignUpRequest),
  ])
}
