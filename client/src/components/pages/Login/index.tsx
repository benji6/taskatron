import { Spinner } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '../../../api'
import {
  deleteCredentials,
  getCredentials,
  setCredentials,
} from '../../../localStorage'

interface IState {
  error: boolean
  isSignedIn: boolean
}

class Login extends React.Component {
  public state: IState = { error: false, isSignedIn: false }

  public async componentDidMount() {
    const credentials = getCredentials()
    const params = new URL(String(document.location)).searchParams
    const token = params.get('token')
    const uid = params.get('uid')

    if (credentials) {
      try {
        await getMe(credentials)
        return this.setState({ isSignedIn: true })
      } catch {
        deleteCredentials()
      }
    }

    if (!token || !uid) return this.setState({ error: true })

    const paramsCredentials = { token, uid }

    try {
      await getMe(paramsCredentials)
      setCredentials(paramsCredentials)
      return this.setState({ isSignedIn: true })
    } catch {
      return this.setState({ error: true })
    }
  }

  public render() {
    const { error, isSignedIn } = this.state

    // TODO we are reloading the page to make sure Apollo Client
    // sets the auth header - need to figure out how to do this
    // dynamically
    if (isSignedIn) window.location.replace('/')
    if (error) {
      return (
        <>
          <h2>Error signing in</h2>
          <p>
            <Link to="sign-in">Click here</Link> to get a new token and remember
            that old tokens may no longer work.
          </p>
        </>
      )
    }
    return <Spinner variant="page" />
  }
}

export default Login
