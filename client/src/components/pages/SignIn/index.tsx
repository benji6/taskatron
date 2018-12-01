import { Button, ButtonGroup, TextField } from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isEmail } from 'shared/types'
import { sendToken } from '../../../api'
import { getFieldError } from '../../../utils'

interface IFormValues {
  email: string
}

interface IState {
  submittedSuccessfully: boolean
}

class SignIn extends React.PureComponent<{}, IState> {
  public state = {
    submittedSuccessfully: false,
  }

  public hasUnmounted = false

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { submittedSuccessfully } = this.state

    return (
      <main>
        {submittedSuccessfully ? (
          <>
            <h2>Sign in Email Sent!</h2>
            <p>Please check your email and click the link to sign in.</p>
            <p>You can close this window now.</p>
          </>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <h2>Sign in</h2>
                <p>
                  Send us your email address and we'll send you a secure link to
                  sign in with.
                </p>
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
                <ButtonGroup>
                  <Button disabled={isSubmitting}>Send link</Button>
                </ButtonGroup>
                <p e-util="center">
                  Don't have an account? <Link to="/sign-up">Sign up</Link>!
                </p>
              </Form>
            )}
          />
        )}
      </main>
    )
  }

  private handleSubmit = async (
    { email }: IFormValues,
    { setErrors, setSubmitting }: FormikActions<IFormValues>,
  ) => {
    try {
      await sendToken(email)
      if (!this.hasUnmounted) {
        this.setState({ submittedSuccessfully: true })
      }
    } catch (e) {
      if (e.message === '400') {
        setErrors({
          email:
            "We don't recognise that email address, please check your spelling or sign up for an account",
        })
        setSubmitting(false)
        return
      }
      setErrors({
        email: 'An unknown error has occurred, please check back shortly',
      })
      setSubmitting(false)
    }
  }

  private validate = ({ email }: IFormValues) =>
    isEmail(email) ? undefined : { email: 'Please enter a valid email address' }
}

export default SignIn
