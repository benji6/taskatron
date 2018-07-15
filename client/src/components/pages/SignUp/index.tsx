import { Field, FieldProps, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { postUser } from '../../../api'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../../../shared/validation'
import getFieldError from '../../../utils/getFieldError'
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

interface IFormValues {
  email: string
  firstName: string
  lastName: string
  postcode: string
}

interface IState {
  email: string
  errorCode?: number
  submittedSuccessfully: boolean
}

class SignUp extends React.PureComponent<{}, IState> {
  public state = {
    email: '',
    errorCode: undefined,
    submittedSuccessfully: false,
  }

  public hasUnmounted = false

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render(): React.ReactNode {
    const { email, errorCode, submittedSuccessfully } = this.state

    return (
      <Main>
        {errorCode === 400 ? (
          <>
            <Heading variation="h2">Sign up Failed</Heading>
            <Paragraph>
              Looks like we already have an account for {email}.
            </Paragraph>
            <Paragraph>
              Try <Link to="/sign-in">signing in</Link>.
            </Paragraph>
          </>
        ) : errorCode === 500 ? (
          <>
            <Heading variation="h2">Sign up Failed</Heading>
            <Paragraph>
              We're sorry, something has gone wrong, please refresh the page and
              try again.
            </Paragraph>
          </>
        ) : submittedSuccessfully ? (
          <>
            <Heading variation="h2">Sign up Email Sent!</Heading>
            <Paragraph>
              Please check your email and click the link to sign in.
            </Paragraph>
          </>
        ) : (
          <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              postcode: '',
            }}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form className="form" noValidate>
                <Heading variation="h2">Sign up</Heading>
                <Paragraph>
                  We just need a few details to get started.
                </Paragraph>
                <Field
                  name="email"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'email')}
                      type="email"
                    >
                      Email
                    </TextField>
                  )}
                />
                <Field
                  name="firstName"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'firstName')}
                    >
                      First name
                    </TextField>
                  )}
                />
                <Field
                  name="lastName"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'lastName')}
                    >
                      Last name
                    </TextField>
                  )}
                />
                <Field
                  name="postcode"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'postcode')}
                    >
                      Postcode
                    </TextField>
                  )}
                />
                <ButtonGroup>
                  <Button disabled={isSubmitting}>Send link</Button>
                </ButtonGroup>
                <Paragraph textCenter>
                  Already have an account? <Link to="/sign-in">Sign in</Link>!
                </Paragraph>
              </Form>
            )}
          />
        )}
      </Main>
    )
  }

  private validate = ({
    email,
    firstName,
    lastName,
    postcode,
  }: IFormValues) => {
    const errors: any = {}
    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!isValidFirstName(firstName)) {
      errors.firstName = 'Please enter a first name'
    }
    if (!isValidLastName(lastName)) errors.lastName = 'Please enter a last name'
    if (!isValidPostcode(postcode)) {
      errors.postcode = 'Please enter a valid postcode'
    }
    return errors
  }

  private handleSubmit = async (values: IFormValues) => {
    this.setState({ email: values.email })

    try {
      await postUser(values)
      if (this.hasUnmounted) return
      this.setState({ submittedSuccessfully: true })
    } catch (e) {
      if (this.hasUnmounted) return
      this.setState({ errorCode: e.message === '400' ? 400 : 500 })
    }
  }
}

export default SignUp
