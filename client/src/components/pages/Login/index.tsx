import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Heading, Link, Main, Paragraph, Spinner } from '../../generic'
import {
  userIsSignedInSelector,
  userLogInFailSelector,
} from '../../../selectors'
import IStore from '../../../types/IStore'

type IProps = {
  isSignedIn: boolean
  logInFail: boolean
}

class Login extends React.PureComponent<IProps> {
  public render() {
    const { isSignedIn, logInFail } = this.props

    if (isSignedIn) return <Redirect to="/" />
    if (logInFail) {
      return (
        <Main>
          <Heading variation="h2">Error Signing In</Heading>
          <Paragraph>
            <Link to="sign-in">Click here</Link> to get a new token and remember
            that old tokens may no longer work.
          </Paragraph>
        </Main>
      )
    }
    return <Spinner page />
  }
}

const mapStateToProps = (state: IStore) => ({
  isSignedIn: userIsSignedInSelector(state),
  logInFail: userLogInFailSelector(state),
})

export default connect(mapStateToProps)(Login)
