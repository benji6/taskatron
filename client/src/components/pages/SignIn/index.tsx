import { Field, FieldProps, Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'
import { sendToken } from '../../../api'
import { isValidEmail } from '../../../shared/validation'
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

  public render(): React.ReactNode {
    const { submittedSuccessfully } = this.state

    return (
      <Main>
        {submittedSuccessfully ? (
          <>
            <Heading variation="h2">Sign in Email Sent!</Heading>
            <Paragraph>
              Please check your email and click the link to sign in.
            </Paragraph>
          </>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form className="form" noValidate>
                <Heading variation="h2">Sign in</Heading>
                <Paragraph>
                  Send us your email address and we'll send you a secure link to
                  sign in with.
                </Paragraph>
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
                <ButtonGroup>
                  <Button disabled={isSubmitting}>Send link</Button>
                </ButtonGroup>
                <Paragraph textCenter>
                  Don't have an account? <Link to="/sign-up">Sign up</Link>!
                </Paragraph>
              </Form>
            )}
          />
        )}
      </Main>
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
    isValidEmail(email)
      ? undefined
      : { email: 'Please enter a valid email address' }
}

export default SignIn
