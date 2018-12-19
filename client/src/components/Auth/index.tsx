import * as React from 'react'
import { connect } from 'react-redux'
import {
  userGetCredentialsFailure,
  userGetFailure,
  userGetSuccess,
  userLogInFail,
} from '../../actions'
import { getMe } from '../../api'
import {
  deleteCredentials,
  getCredentials,
  setCredentials,
} from '../../localStorage'

interface IProps {
  onUserGetCredentialsFailure: typeof userGetCredentialsFailure
  onUserGetFailure: typeof userGetFailure
  onUserGetSuccess: typeof userGetSuccess
  onUserLogInFail: typeof userLogInFail
}

class Auth extends React.PureComponent<IProps> {
  public async componentDidMount() {
    const {
      onUserGetCredentialsFailure,
      onUserGetFailure,
      onUserGetSuccess,
      onUserLogInFail,
    } = this.props
    const credentials = getCredentials()
    const params = new URL(String(document.location)).searchParams
    const token = params.get('token')
    const uid = params.get('uid')

    if (credentials) {
      try {
        const user = await getMe(credentials)
        onUserGetSuccess(user)
      } catch (e) {
        if (location.pathname === '/login') {
          if (token && uid) {
            const paramsCredentials = { token, uid }
            try {
              const user = await getMe(paramsCredentials)
              onUserGetSuccess(user)
              setCredentials(paramsCredentials)
            } catch (e) {
              onUserLogInFail()
            }
          }
          return
        }
        onUserGetFailure()
        const statusCode = Number(e.message)
        if (statusCode >= 500 && statusCode < 600) return
        deleteCredentials()
      }
      return
    }

    if (location.pathname === '/login') {
      if (token && uid) {
        const paramsCredentials = { token, uid }
        try {
          const user = await getMe(paramsCredentials)
          onUserGetSuccess(user)
          setCredentials(paramsCredentials)
        } catch (e) {
          onUserLogInFail()
        }
      }
      return
    }

    onUserGetCredentialsFailure()
  }

  public render() {
    return null
  }
}

const mapDispatchToProps = {
  onUserGetCredentialsFailure: userGetCredentialsFailure,
  onUserGetFailure: userGetFailure,
  onUserGetSuccess: userGetSuccess,
  onUserLogInFail: userLogInFail,
}

export default connect(
  null,
  mapDispatchToProps,
)(Auth)
