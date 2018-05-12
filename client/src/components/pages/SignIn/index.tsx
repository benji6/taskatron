import * as React from 'react';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from 'react-router'
import {authSignInRequest} from '../../../actions'
import {
  isRequestingSignInSelector,
  signInEmailSentSelector,
} from '../../../selectors'
import IStore from '../../../types/IStore';
import {
  Button,
  ButtonGroup,
  Heading,
  Main,
  TextField
} from '../../generic'

interface IProps extends RouteComponentProps<any> {
  emailSent: boolean
  history: any
  isRequesting: boolean
  signIn: typeof authSignInRequest
}

interface IState {
  email: string
  error: boolean
}

class SignIn extends React.PureComponent<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.goBack = this.goBack.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      email: '',
      error: false
    }
  }

  public render (): React.ReactNode {
    const {goBack, handleChange, handleSubmit} = this
    const {error} = this.state
    const {emailSent, isRequesting} = this.props

    return (
      <Main>
        {emailSent ? (
          <>
            <Heading variation="h1">Sign in Email Sent!</Heading>
            <p>Please check your email and click the link to sign in.</p>
            <ButtonGroup>
              <Button onClick={goBack}>
                Got it!
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Heading variation="h1">Sign in</Heading>
            <p>Send us your email address and we'll send you a secure link to sign in with.</p>
            <TextField error={error ? 'Please enter a valid email address' : undefined} onChange={handleChange} type="email">
              Email
            </TextField>
            <ButtonGroup>
              <Button disabled={isRequesting}>
                Send link
              </Button>
              <Button onClick={goBack} type="button" variation="secondary">
                Back
              </Button>
            </ButtonGroup>
          </form>
        )}
      </Main>
    )
  }

  private goBack(): void {
    this.props.history.goBack();
  }

  private handleChange(e: any): void {
    this.setState({email: e.target.value})
  }

  private handleSubmit (e: any): void {
    e.preventDefault()

    const {email} = this.state
    const {signIn} = this.props

    if (/.+@.+/.test(email)) {
      this.setState({error: false})
      signIn(email)
      return
    }

    this.setState({error: true})
  }
}

const mapStateToProps = (state: IStore) => ({
  emailSent: signInEmailSentSelector(state),
  isRequesting: isRequestingSignInSelector(state),
})

const mapDispatchToProps = {
  signIn: authSignInRequest
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn))
