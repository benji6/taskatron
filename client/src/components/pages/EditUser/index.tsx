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
import { Mutation, Query } from 'react-apollo'
import { Link, Redirect } from 'react-router-dom'
import { isFirstName, isLastName, isPostcode } from 'shared/types'
import { getFieldError } from '../../../utils'
import GenericErrorMessage from '../../GenericErrorMessage'
import mutation from './mutation'
import query from './query'

interface IFormValues {
  firstName: string
  lastName: string
  postcode: string
}

interface IProps {
  firstName: string
  lastName: string
  postcode: string
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
    const { error, submittedSuccessfully } = this.state

    return error ? (
      <GenericErrorMessage />
    ) : submittedSuccessfully ? (
      <Redirect to="/profile" />
    ) : (
      <Mutation
        mutation={mutation}
        update={(cache, { data: { meUpdate } }) => {
          const cached: any = cache.readQuery({ query })
          cache.writeQuery({
            data: { me: { ...cached.me, ...meUpdate } },
            query,
          })
        }}
      >
        {updateMe => {
          return (
            <Query query={query}>
              {({ data, error: queryError, loading }) => {
                if (loading) return <Spinner variant="page" />
                if (queryError) return <GenericErrorMessage />
                const {
                  me: { firstName, lastName, postcode },
                } = data
                const initialValues = {
                  firstName,
                  lastName,
                  postcode,
                }
                const handleSubmit = async (
                  values: IFormValues,
                  actions: FormikActions<IFormValues>,
                ) => {
                  try {
                    await updateMe({ variables: values })
                    if (this.hasUnmounted) return

                    actions.setSubmitting(false)
                    this.setState({ submittedSuccessfully: true })
                  } catch (e) {
                    if (this.hasUnmounted) return
                    actions.setSubmitting(false)
                    this.setState({ error: true })
                  }
                }
                return (
                  <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={this.validate}
                    render={({ isSubmitting }: FormikProps<IFormValues>) => (
                      <Form noValidate>
                        <h2>Edit my details</h2>
                        <p>Tell us about yourself.</p>
                        <Field
                          autocomplete="given-name"
                          name="firstName"
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
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
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
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
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
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
        }}
      </Mutation>
    )
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

export default EditUser
