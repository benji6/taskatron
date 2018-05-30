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
  readonly firstName: string
  readonly firstNameError: boolean
  readonly lastName: string
  readonly lastNameError: boolean
}

class SignUp extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      email: '',
      emailError: false,
      firstName: '',
      firstNameError: false,
      lastName: '',
      lastNameError: false,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public render (): React.ReactNode {
    const {
      handleEmailChange,
      handleFirstNameChange,
      handleLastNameChange,
      handleSubmit,
    } = this

    const {
      firstNameError,
      emailError,
      lastNameError,
    } = this.state

    return (
      <Main>
        <form onSubmit={handleSubmit} noValidate>
          <Heading variation="h2">Sign Up</Heading>
          <Paragraph>We just need a few details to get started.</Paragraph>
          <TextField error={firstNameError ? 'Please enter a first name' : undefined} onChange={handleFirstNameChange}>
            First Name
          </TextField>
          <TextField error={lastNameError ? 'Please enter a last name' : undefined} onChange={handleLastNameChange}>
            Last Name
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

  private handleFirstNameChange(e: any): void {
    this.setState({firstName: e.target.value})
  }

  private handleLastNameChange(e: any): void {
    this.setState({lastName: e.target.value})
  }

  private handleSubmit (e: any): void {
    e.preventDefault()

    const {email, firstName, lastName} = this.state
    const {signUp} = this.props

    const isEmailValid = /.+@.+/.test(email)
    const isFirstNameValid = Boolean(firstName.length)
    const isLastNameValid = Boolean(lastName.length)

    this.setState({
      emailError: !isEmailValid,
      firstNameError: !isFirstNameValid,
      lastNameError: !isLastNameValid,
    })

    if (isEmailValid && isFirstNameValid && isLastNameValid) {
      signUp({
        email,
        firstName,
        lastName,
      })
    }
  }
}

const mapDispatchToProps = {
  signUp: userSignUpRequest
}

export default connect(null, mapDispatchToProps)(SignUp)
