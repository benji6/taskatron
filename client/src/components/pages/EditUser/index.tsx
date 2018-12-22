import { Button, ButtonGroup, Spinner, TextField } from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { isFirstName, isLastName, isPostcode } from 'shared/types'
import { userSet } from '../../../actions'
import { patchMe } from '../../../api'
import { getFieldError } from '../../../utils'
import query from './query'

interface IFormValues {
  firstName: string
  lastName: string
  postcode: string
  radius: string
}

interface IProps {
  firstName: string
  lastName: string
  postcode: string
  radius: number
  setUser: typeof userSet
}

interface IState {
  error: boolean
  submittedSuccessfully: boolean
}

class EditUser extends React.PureComponent<IProps> {
  public hasUnmounted = false

  public state: IState = {
    error: false,
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { radius } = this.props
    const { error, submittedSuccessfully } = this.state

    return error ? (
      <p e-util="negative">Oops, there was an error, please try again.</p>
    ) : submittedSuccessfully ? (
      <Redirect to="/profile" />
    ) : (
      <Query query={query}>
        {({ data, error: queryError, loading }) => {
          if (loading) return <Spinner variation="page" />
          if (queryError) {
            return (
              <p e-util="negative">
                Oops, there was an error, please try again.
              </p>
            )
          }
          const {
            me: { firstName, lastName, postcode },
          } = data
          const initialValues = {
            firstName,
            lastName,
            postcode,
            radius: String(radius),
          }
          return (
            <Formik
              initialValues={initialValues}
              onSubmit={this.handleSubmit}
              validate={this.validate}
              render={({ isSubmitting }: FormikProps<IFormValues>) => (
                <Form noValidate>
                  <h2>Edit my details</h2>
                  <p>Tell us about yourself.</p>
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
                  <ButtonGroup>
                    <Button disabled={isSubmitting}>Save</Button>
                    <Link to="/profile">Cancel</Link>
                  </ButtonGroup>
                </Form>
              )}
            />
          )
        }}
      </Query>
    )
  }

  private handleSubmit = async (
    values: IFormValues,
    actions: FormikActions<IFormValues>,
  ) => {
    try {
      const body = { ...values, radius: Number(values.radius) }
      await patchMe(body)
      this.props.setUser(body)

      if (this.hasUnmounted) return

      actions.setSubmitting(false)
      this.setState({ submittedSuccessfully: true })
    } catch (e) {
      if (this.hasUnmounted) return
      actions.setSubmitting(false)
      this.setState({ error: true })
    }
  }

  private validate = ({ firstName, lastName, postcode }: IFormValues) => {
    const errors: any = {}
    if (!isFirstName(firstName)) {
      errors.firstName = 'Please enter a first name'
    }
    if (!isLastName(lastName)) errors.lastName = 'Please enter a last name'
    if (!isPostcode(postcode)) {
      errors.postcode = 'Please enter a valid postcode'
    }
    return errors
  }
}

const mapDispatchToProps = {
  setUser: userSet,
}

export default connect(
  undefined,
  mapDispatchToProps,
)(EditUser)
