import * as React from 'react'
import { connect } from 'react-redux'
import { authSignInRequest, userSignInUnmount } from '../../../actions'
import {
  isRequestingSignInSelector,
  signInEmailNotRecognisedSelector,
  signInEmailSentSelector,
  signInUnknownErrorSelector,
} from '../../../selectors'
import { isValidEmail } from '../../../shared/validation'
import IStore from '../../../types/IStore'
import {
  Button,
  ButtonGroup,
  Form,
  Heading,
  Link,
  Main,
  Paragraph,
  TextField,
} from '../../generic'

interface IProps {
  emailNotRecognised: boolean
  emailSent: boolean
  handleUnmount: typeof userSignInUnmount
  history: any
  isRequesting: boolean
  signIn: typeof authSignInRequest
  signInUnknownError: boolean
}

interface IState {
  readonly email: string
  readonly error: boolean
}

class SignIn extends React.PureComponent<IProps, IState> {
  public state = {
    email: '',
    error: false,
  }

  public componentWillUnmount() {
    this.props.handleUnmount()
  }

  public render(): React.ReactNode {
    const {
      handleChange,
      handleSubmit,
      props: {
        emailNotRecognised,
        emailSent,
        isRequesting,
        signInUnknownError,
      },
      state: { error },
    } = this

    const errorMessage = error
      ? 'Please enter a valid email address'
      : emailNotRecognised
        ? "We don't recognise that email address, please check your spelling or sign up for an account"
        : signInUnknownError
          ? 'An unknown error has occurred, please check back shortly'
          : undefined

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
              Send us your email address and we'll send you a secure link to
              sign in with.
            </Paragraph>
            <TextField
              error={errorMessage}
              onChange={handleChange}
              type="email"
            >
              Email
            </TextField>
            <ButtonGroup>
              <Button disabled={isRequesting}>Send link</Button>
            </ButtonGroup>
            <Paragraph textCenter>
              Don't have an account? <Link to="/sign-up">Sign up</Link>!
            </Paragraph>
          </Form>
        )}
      </Main>
    )
  }

  private handleChange = (e: any): void => {
    this.setState({ email: e.target.value })
  }

  private handleSubmit = (e: any): void => {
    e.preventDefault()

    const { email } = this.state
    const { signIn } = this.props

    if (isValidEmail(email)) {
      this.setState({ error: false })
      signIn(email)
      return
    }

    this.setState({ error: true })
  }
}

const mapStateToProps = (state: IStore) => ({
  emailNotRecognised: signInEmailNotRecognisedSelector(state),
  emailSent: signInEmailSentSelector(state),
  isRequesting: isRequestingSignInSelector(state),
  signInUnknownError: signInUnknownErrorSelector(state),
})

const mapDispatchToProps = {
  handleUnmount: userSignInUnmount,
  signIn: authSignInRequest,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn)
