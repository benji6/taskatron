import { gql } from 'apollo-boost'
import {
  Button,
  ButtonGroup,
  Checkbox,
  CurrencyField,
  Select,
  TextArea,
  TextField,
} from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { userIdSelector } from '../../../selectors'
import { radii } from '../../../shared/constants'
import { isValidNumber } from '../../../shared/validation'
import IStore from '../../../types/IStore'
import { getFieldError } from '../../../utils'

interface IFormValues {
  carpetClean: boolean
  deepClean: boolean
  description: string
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: string
  ovenClean: boolean
  radius: string
  serviceName: string
}

interface IProps {
  userId: string
}

interface IState {
  submittedSuccessfully: boolean
}

const addServiceMutation = gql`
  mutation AddService(
    $carpetClean: Boolean
    $deepClean: Boolean
    $description: String!
    $general: Boolean
    $hasOwnEquipment: Boolean
    $hasOwnProducts: Boolean
    $hourlyRate: Float!
    $name: String!
    $ovenClean: Boolean
    $radius: Int!
    $userId: ID!
  ) {
    addService(
      carpetClean: $carpetClean
      deepClean: $deepClean
      description: $description
      general: $general
      hasOwnEquipment: $hasOwnEquipment
      hasOwnProducts: $hasOwnProducts
      hourlyRate: $hourlyRate
      name: $name
      ovenClean: $ovenClean
      radius: $radius
      userId: $userId
    ) {
      carpetClean
      deepClean
      description
      general
      hasOwnEquipment
      hasOwnProducts
      hourlyRate
      id
      name
      ovenClean
      radius
      userId
    }
  }
`

class AddService extends React.PureComponent<IProps> {
  public hasUnmounted = false

  public state: IState = {
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { userId } = this.props
    const { submittedSuccessfully } = this.state

    if (submittedSuccessfully) return <Redirect to="/profile" />

    const initialValues = {
      carpetClean: false,
      deepClean: false,
      description: '',
      general: false,
      hasOwnEquipment: false,
      hasOwnProducts: false,
      hourlyRate: '',
      ovenClean: false,
      radius: '__initial',
      serviceName: '',
    }

    return (
      <main>
        <Mutation mutation={addServiceMutation}>
          {addService => {
            const handleSubmit = async (
              values: IFormValues,
              actions: FormikActions<IFormValues>,
            ) => {
              const { serviceName: name, ...rest } = values

              await addService({
                variables: {
                  ...rest,
                  hourlyRate: Number(values.hourlyRate),
                  name,
                  radius: Number(values.radius),
                  userId,
                },
              })

              if (this.hasUnmounted) return

              actions.setSubmitting(false)

              this.setState({ submittedSuccessfully: true })
            }

            return (
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={this.validate}
                render={({ isSubmitting }: FormikProps<IFormValues>) => (
                  <Form noValidate>
                    <h2>Add cleaning service</h2>
                    <p>Tell us about the cleaning service you're offering.</p>
                    <Field
                      name="serviceName"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <TextField
                          {...field}
                          error={getFieldError(form, 'serviceName')}
                          label="Name"
                          supportiveText="This is the name people will see in their search results, put your name or company name"
                        />
                      )}
                    />
                    <Field
                      name="description"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <TextArea
                          {...field}
                          error={getFieldError(form, 'description')}
                          label="Description"
                          supportiveText="Let people know a little bit about yourself and the service you are offering"
                        />
                      )}
                    />
                    <Field
                      name="hourlyRate"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <CurrencyField
                          {...field}
                          error={getFieldError(form, 'hourlyRate')}
                          label="Hourly rate"
                        />
                      )}
                    />
                    <Field
                      name="radius"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Select
                          {...field}
                          error={getFieldError(form, 'radius')}
                          label="Working range"
                          supportiveText="This is how far from your home you are willing to travel"
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
                    <Field
                      name="general"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'general')}
                          label="General clean"
                        />
                      )}
                    />
                    <Field
                      name="deepClean"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'deepClean')}
                          label="Oneoff deep clean"
                        />
                      )}
                    />
                    <Field
                      name="carpetClean"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'carpetClean')}
                          label="Specialist clean  carpets"
                        />
                      )}
                    />
                    <Field
                      name="ovenClean"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'ovenClean')}
                          label="Specialist clean  oven"
                        />
                      )}
                    />
                    <Field
                      name="hasOwnProducts"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'hasOwnProducts')}
                          label="I have my own cleaning products"
                        />
                      )}
                    />
                    <Field
                      name="hasOwnEquipment"
                      render={({ field, form }: FieldProps<IFormValues>) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          error={getFieldError(form, 'hasOwnEquipment')}
                          label="I have my own cleaning equipment"
                        />
                      )}
                    />
                    <ButtonGroup>
                      <Button disabled={isSubmitting}>Save</Button>
                      <Link to="/services">Cancel</Link>
                    </ButtonGroup>
                  </Form>
                )}
              />
            )
          }}
        </Mutation>
      </main>
    )
  }

  private validate = ({
    description,
    hourlyRate,
    radius,
    serviceName,
  }: IFormValues) => {
    const errors: any = {}

    if (!isValidNumber(hourlyRate)) {
      errors.hourlyRate = 'Please enter a valid hourly rate'
    }

    if (radius === '__initial') errors.radius = 'Please select a radius'
    if (!description) errors.description = 'Please enter a description'
    if (!serviceName) errors.serviceName = 'Please enter a name'

    return errors
  }
}

const mapStateToProps = (state: IStore) => ({
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(AddService)
