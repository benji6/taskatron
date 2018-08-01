import { Button, ButtonGroup, TextField } from 'eri'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { postUser } from '../../../api'
import {
  isValidEmail,
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../../../shared/validation'
import getFieldError from '../../../utils/getFieldError'

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
      <main>
        {errorCode === 400 ? (
          <>
            <h2>Sign up Failed</h2>
            <p>Looks like we already have an account for {email}.</p>
            <p>
              Try <Link to="/sign-in">signing in</Link>.
            </p>
          </>
        ) : errorCode === 500 ? (
          <>
            <h2>Sign up Failed</h2>
            <p>
              We're sorry, something has gone wrong, please refresh the page and
              try again.
            </p>
          </>
        ) : submittedSuccessfully ? (
          <>
            <h2>Sign up Email Sent!</h2>
            <p>Please check your email and click the link to sign in.</p>
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
              <Form>
                <h2>Sign up</h2>
                <p>We just need a few details to get started.</p>
                <Field
                  name="email"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'email')}
                      label="Email"
                      type="email"
                    />
                  )}
                />
                <Field
                  name="firstName"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'firstName')}
                      label="First name"
                    />
                  )}
                />
                <Field
                  name="lastName"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'lastName')}
                      label="Last name"
                    />
                  )}
                />
                <Field
                  name="postcode"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'postcode')}
                      label="Postcode"
                    />
                  )}
                />
                <ButtonGroup>
                  <Button disabled={isSubmitting}>Send link</Button>
                </ButtonGroup>
                <p e-util="center">
                  Already have an account? <Link to="/sign-in">Sign in</Link>!
                </p>
              </Form>
            )}
          />
        )}
      </main>
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
