import { Button, ButtonGroup, Select, TextField } from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { userSet } from '../../../actions'
import { patchMe } from '../../../api'
import {
  userFirstNameSelector,
  userLastNameSelector,
  userPostcodeSelector,
  userRadiusSelector,
} from '../../../selectors'
import { radii } from '../../../shared/constants'
import {
  isValidFirstName,
  isValidLastName,
  isValidPostcode,
} from '../../../shared/validation'
import IStore from '../../../types/IStore'
import getFieldError from '../../../utils/getFieldError'

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

class Profile extends React.PureComponent<IProps> {
  public hasUnmounted = false

  public state: IState = {
    error: false,
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { firstName, lastName, postcode, radius } = this.props
    const { error, submittedSuccessfully } = this.state

    const initialValues = {
      firstName,
      lastName,
      postcode,
      radius: String(radius),
    }

    return (
      <main>
        {error ? (
          <p>Oops, there was an error, please try again.</p>
        ) : submittedSuccessfully ? (
          <Redirect to="/services" />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <h2>About me</h2>
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
                <Field
                  name="radius"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Select
                      {...field}
                      error={getFieldError(form, 'radius')}
                      label="Working radius"
                    >
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
                  <Button disabled={isSubmitting}>Save</Button>
                  <Link to="/services">Cancel</Link>
                </ButtonGroup>
              </Form>
            )}
          />
        )}
      </main>
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
    if (!isValidFirstName(firstName)) {
      errors.firstName = 'Please enter a first name'
    }
    if (!isValidLastName(lastName)) errors.lastName = 'Please enter a last name'
    if (!isValidPostcode(postcode)) {
      errors.postcode = 'Please enter a valid postcode'
    }
    return errors
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state) as string,
  lastName: userLastNameSelector(state) as string,
  postcode: userPostcodeSelector(state) as string,
  radius: userRadiusSelector(state) as number,
})

const mapDispatchToProps = {
  setUser: userSet,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile)
