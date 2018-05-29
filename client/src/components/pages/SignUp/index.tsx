import * as React from 'react';
import {connect} from 'react-redux'
import {userSignUpRequest} from '../../../actions'
import {
  Button,
  ButtonGroup,
  Heading,
  Link,
  Main,
  Paragraph,
  TextField,
} from '../../generic'

interface IProps {
  readonly signUp: typeof userSignUpRequest
}

interface IState {
  readonly email: string
  readonly emailError: boolean
  readonly username: string
  readonly usernameError: boolean
}

class SignUp extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      email: '',
      emailError: false,
      username: '',
      usernameError: false,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public render (): React.ReactNode {
    const {
      handleEmailChange,
      handleUsernameChange,
      handleSubmit,
    } = this

    const {usernameError, emailError} = this.state

    return (
      <Main>
        <form onSubmit={handleSubmit} noValidate>
          <Heading variation="h2">Sign Up</Heading>
          <Paragraph>We just need a few details to get started.</Paragraph>
          <TextField error={usernameError ? 'Please enter a username' : undefined} onChange={handleUsernameChange}>
            Username
          </TextField>
          <TextField error={emailError ? 'Please enter a valid email address' : undefined} onChange={handleEmailChange} type="email">
            Email
          </TextField>
          <ButtonGroup>
            <Button>
              Sign up
            </Button>
          </ButtonGroup>
          <Paragraph center>
            Already have an account? <Link to="/sign-in">Sign in</Link>!
          </Paragraph>
        </form>
      </Main>
    )
  }

  private handleEmailChange(e: any): void {
    this.setState({email: e.target.value})
  }

  private handleUsernameChange(e: any): void {
    this.setState({username: e.target.value})
  }

  private handleSubmit (e: any): void {
    e.preventDefault()

    const {email, username} = this.state
    const {signUp} = this.props

    const isEmailValid = /.+@.+/.test(email)
    const isUsernameValid = Boolean(username.length)

    this.setState({
      emailError: !isEmailValid,
      usernameError: !isUsernameValid
    })

    if (isEmailValid && isUsernameValid) {
      signUp(email)
    }
  }
}

const mapDispatchToProps = {
  signUp: userSignUpRequest
}

export default connect(null, mapDispatchToProps)(SignUp)
