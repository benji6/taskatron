import { Spinner } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import {
  userIsSignedInSelector,
  userLogInFailSelector,
} from '../../../selectors'
import IStore from '../../../types/IStore'

interface IProps {
  isSignedIn: boolean
  logInFail: boolean
}

class Login extends React.PureComponent<IProps> {
  public render() {
    const { isSignedIn, logInFail } = this.props

    if (isSignedIn) return <Redirect to="/" />
    if (logInFail) {
      return (
        <main>
          <h2>Error Signing In</h2>
          <p>
            <Link to="sign-in">Click here</Link> to get a new token and remember
            that old tokens may no longer work.
          </p>
        </main>
      )
    }
    return <Spinner variation="page" />
  }
}

const mapStateToProps = (state: IStore) => ({
  isSignedIn: userIsSignedInSelector(state),
  logInFail: userLogInFailSelector(state),
})

export default connect(mapStateToProps)(Login)
