import * as React from 'react'
import { connect } from 'react-redux'
import { userSignUpRequest } from '../../../actions'
import { hasSignedUpSelector, signUpFailureSelector } from '../../../selectors'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
} from '../../../shared/validation'
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
  readonly hasSignedUp: boolean
  readonly signUp: typeof userSignUpRequest
  readonly signUpFailure: boolean
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

  public render(): React.ReactNode {
    const {
      handleEmailChange,
      handleFirstNameChange,
      handleLastNameChange,
      handleSubmit,
      props: { hasSignedUp, signUpFailure },
      state: { firstNameError, emailError, lastNameError },
    } = this

    return (
      <Main>
        {signUpFailure ? (
          <>
            <Heading variation="h2">Sign up Failed</Heading>
            <Paragraph>
              We're sorry, something has gone wrong, please refresh the page and
              try again.
            </Paragraph>
          </>
        ) : hasSignedUp ? (
          <>
            <Heading variation="h2">Sign up Email Sent!</Heading>
            <Paragraph>
              Please check your email and click the link to sign in.
            </Paragraph>
          </>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            <Heading variation="h2">Sign Up</Heading>
            <Paragraph>We just need a few details to get started.</Paragraph>
            <TextField
              error={firstNameError ? 'Please enter a first name' : undefined}
              onChange={handleFirstNameChange}
            >
              First Name
            </TextField>
            <TextField
              error={lastNameError ? 'Please enter a last name' : undefined}
              onChange={handleLastNameChange}
            >
              Last Name
            </TextField>
            <TextField
              error={
                emailError ? 'Please enter a valid email address' : undefined
              }
              onChange={handleEmailChange}
              type="email"
            >
              Email
            </TextField>
            <ButtonGroup>
              <Button>Sign up</Button>
            </ButtonGroup>
            <Paragraph center>
              Already have an account? <Link to="/sign-in">Sign in</Link>!
            </Paragraph>
          </Form>
        )}
      </Main>
    )
  }

  private handleEmailChange(e: any): void {
    this.setState({ email: e.target.value })
  }

  private handleFirstNameChange(e: any): void {
    this.setState({ firstName: e.target.value })
  }

  private handleLastNameChange(e: any): void {
    this.setState({ lastName: e.target.value })
  }

  private handleSubmit(e: any): void {
    e.preventDefault()

    const { email, firstName, lastName } = this.state
    const { signUp } = this.props

    const isEmailValid = isValidEmail(email)
    const isFirstNameValid = isValidFirstName(firstName.length)
    const isLastNameValid = isValidLastName(lastName.length)

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

const mapStateToProps = (state: IStore) => ({
  hasSignedUp: hasSignedUpSelector(state),
  signUpFailure: signUpFailureSelector(state),
})

const mapDispatchToProps = {
  signUp: userSignUpRequest,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp)
