import * as React from 'react';
import {connect} from 'react-redux'
import {authSignInRequest} from '../../../actions'
import {
  isRequestingSignInSelector,
  signInEmailSentSelector,
} from '../../../selectors'
import {isValidEmail} from '../../../shared/validation';
import IStore from '../../../types/IStore';
import {
  Button,
  ButtonGroup,
  Form,
  Heading,
  Link,
  Main,
  Paragraph,
  TextField
} from '../../generic'

interface IProps {
  emailSent: boolean
  history: any
  isRequesting: boolean
  signIn: typeof authSignInRequest
}

interface IState {
  readonly email: string
  readonly error: boolean
}

class SignIn extends React.PureComponent<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      email: '',
      error: false
    }
  }

  public render (): React.ReactNode {
    const {handleChange, handleSubmit} = this
    const {error} = this.state
    const {emailSent, isRequesting} = this.props

    return (
      <Main>
        {emailSent ? (
          <>
            <Heading variation="h2">Sign in Email Sent!</Heading>
            <Paragraph>
              Please check your email and click the link to sign in.
            </Paragraph>
          </>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            <Heading variation="h2">Sign in</Heading>
            <Paragraph>
              Send us your email address and we'll send you a secure link to sign in with.
            </Paragraph>
            <TextField error={error ? 'Please enter a valid email address' : undefined} onChange={handleChange} type="email">
              Email
            </TextField>
            <ButtonGroup>
              <Button disabled={isRequesting}>
                Send link
              </Button>
            </ButtonGroup>
            <Paragraph center>
              Don't have an account? <Link to="/sign-up">Sign up</Link>!
            </Paragraph>
          </Form>
        )}
      </Main>
    )
  }

  private handleChange(e: any): void {
    this.setState({email: e.target.value})
  }

  private handleSubmit (e: any): void {
    e.preventDefault()

    const {email} = this.state
    const {signIn} = this.props

    if (isValidEmail(email)) {
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
