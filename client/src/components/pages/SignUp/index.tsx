import * as React from 'react'
import { connect } from 'react-redux'
import { userSignUpRequest } from '../../../actions'
import { hasSignedUpSelector, signUpFailureSelector } from '../../../selectors'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
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
  hasSignedUp: boolean
  signUp: typeof userSignUpRequest
  signUpFailure: boolean
}

interface IState {
  email: string
  emailError: boolean
  firstName: string
  firstNameError: boolean
  lastName: string
  lastNameError: boolean
  postcode: string
  postcodeError: boolean
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
      postcode: '',
      postcodeError: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public render(): React.ReactNode {
    const {
      handleEmailChange,
      handleFirstNameChange,
      handleLastNameChange,
      handlePostcodeChange,
      handleSubmit,
      props: { hasSignedUp, signUpFailure },
      state: { firstNameError, emailError, lastNameError, postcodeError },
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
              error={
                emailError ? 'Please enter a valid email address' : undefined
              }
              onChange={handleEmailChange}
              type="email"
            >
              Email
            </TextField>
            <TextField
              error={firstNameError ? 'Please enter a first name' : undefined}
              onChange={handleFirstNameChange}
            >
              First name
            </TextField>
            <TextField
              error={lastNameError ? 'Please enter a last name' : undefined}
              onChange={handleLastNameChange}
            >
              Last name
            </TextField>
            <TextField
              error={
                postcodeError ? 'Please enter a valid postcode' : undefined
              }
              onChange={handlePostcodeChange}
            >
              Postcode
            </TextField>
            <ButtonGroup>
              <Button>Sign up</Button>
            </ButtonGroup>
            <Paragraph textCenter>
              Already have an account? <Link to="/sign-in">Sign in</Link>!
            </Paragraph>
          </Form>
        )}
      </Main>
    )
  }

  private handleEmailChange = (e: any): void => {
    this.setState({ email: e.target.value })
  }

  private handleFirstNameChange = (e: any): void => {
    this.setState({ firstName: e.target.value })
  }

  private handleLastNameChange = (e: any): void => {
    this.setState({ lastName: e.target.value })
  }

  private handlePostcodeChange = (e: any): void => {
    this.setState({ postcode: e.target.value })
  }

  private handleSubmit(e: any): void {
    e.preventDefault()

    const { email, firstName, lastName, postcode } = this.state
    const { signUp } = this.props

    const isEmailValid = isValidEmail(email)
    const isFirstNameValid = isValidFirstName(firstName)
    const isLastNameValid = isValidLastName(lastName)
    const isPostcodeValid = isValidPostcode(postcode)

    this.setState({
      emailError: !isEmailValid,
      firstNameError: !isFirstNameValid,
      lastNameError: !isLastNameValid,
      postcodeError: !isPostcodeValid,
    })

    if (
      isEmailValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isPostcodeValid
    ) {
      signUp({
        email,
        firstName,
        lastName,
        postcode,
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
