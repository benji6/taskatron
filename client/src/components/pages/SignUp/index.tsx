import { Button, ButtonGroup, Select, TextField } from 'eri'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { postUser } from '../../../api'
import { radii } from '../../../shared/constants'
import {
  isEmail,
  isFirstName,
  isLastName,
  isPostcode,
} from '../../../shared/types'
import { getFieldError } from '../../../utils'

interface IFormValues {
  email: string
  firstName: string
  lastName: string
  postcode: string
  radius: string
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
            <p>You can close this window now.</p>
          </>
        ) : (
          <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              postcode: '',
              radius: '_initial',
            }}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <h2>Sign up</h2>
                <p>We just need a few details to get started.</p>
                <Field
                  name="email"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      autoComplete="email"
                      error={getFieldError(form, 'email')}
                      label="Email"
                      type="email"
                    />
                  )}
                />
                <Field
                  autocomplete="given-name"
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
                  autocomplete="family-name"
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
                  autocomplete="postal-code"
                  name="postcode"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'postcode')}
                      label="Postcode"
                    />
                  )}
                />
                <Field
                  name="radius"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Select
                      {...field}
                      error={getFieldError(form, 'radius')}
                      label="Working radius"
                    >
                      <option hidden value="_initial">
                        Select
                      </option>
                      {radii.map(r => (
                        <option key={r} value={r}>
                          {r} mile
                          {r === 1 ? '' : 's'}
                        </option>
                      ))}
                    </Select>
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
    radius,
  }: IFormValues) => {
    const errors: any = {}
    if (!isEmail(email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!isFirstName(firstName)) {
      errors.firstName = 'Please enter a first name'
    }
    if (!isLastName(lastName)) errors.lastName = 'Please enter a last name'
    if (!isPostcode(postcode)) {
      errors.postcode = 'Please enter a valid postcode'
    }
    if (radius === '_initial') {
      errors.radius = 'Please select a radius'
    }
    return errors
  }

  private handleSubmit = async (values: IFormValues) => {
    this.setState({ email: values.email })

    try {
      await postUser({ ...values, radius: Number(values.radius) })
      if (this.hasUnmounted) return
      this.setState({ submittedSuccessfully: true })
    } catch (e) {
      if (this.hasUnmounted) return
      this.setState({ errorCode: e.message === '400' ? 400 : 500 })
    }
  }
}

export default SignUp
