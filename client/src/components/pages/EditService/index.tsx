import {
  Button,
  ButtonGroup,
  Checkbox,
  CurrencyField,
  Select,
  Spinner,
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
import { Mutation, Query } from 'react-apollo'
import { Link, Redirect } from 'react-router-dom'
import {
  maxServiceDescriptionLength,
  maxServiceNameLength,
} from 'shared/constants'
import { isValidNumber } from 'shared/validation'
import { radii } from '../../../constants'
import { getUserId } from '../../../localStorage'
import { getFieldError, renderDecimal } from '../../../utils'
import GenericErrorMessage from '../../GenericErrorMessage'
import mutation from './mutation'
import query from './query'

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

interface IState {
  submittedSuccessfully: boolean
}

class EditService extends React.PureComponent {
  public hasUnmounted = false

  public state: IState = {
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { submittedSuccessfully } = this.state

    return (
      <Query
        fetchPolicy="network-only"
        query={query}
        variables={{ userId: getUserId() }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Spinner variant="page" />
          if (error) return <GenericErrorMessage />
          if (submittedSuccessfully) return <Redirect to="/profile" />

          const [service] = data.services.nodes

          const initialValues = {
            carpetClean: service.carpetClean,
            deepClean: service.deepClean,
            description: service.description,
            general: service.general,
            hasOwnEquipment: service.hasOwnEquipment,
            hasOwnProducts: service.hasOwnProducts,
            hourlyRate: renderDecimal(service.hourlyRate),
            ovenClean: service.ovenClean,
            radius: String(service.radius),
            serviceName: service.name,
          }

          return (
            <Mutation mutation={mutation}>
              {updateService => {
                const handleSubmit = async (
                  values: IFormValues,
                  actions: FormikActions<IFormValues>,
                ) => {
                  const { serviceName: name, ...rest } = values
                  const { location, userId: _, ...serviceRest } = service

                  await updateService({
                    variables: {
                      ...serviceRest,
                      ...rest,
                      hourlyRate: Number(values.hourlyRate),
                      name,
                      radius: Number(values.radius),
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
                        <h2>Edit cleaning service</h2>
                        <p>Edit the details of your cleaning service</p>
                        <Field
                          name="serviceName"
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
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
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
                            <TextArea
                              {...field}
                              error={getFieldError(form, 'description')}
                              label="Description"
                              supportiveText={`Let people know a little bit about yourself and the service you are offering (${maxServiceDescriptionLength} characters maximum)`}
                            />
                          )}
                        />
                        <Field
                          name="hourlyRate"
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
                            <CurrencyField
                              {...field}
                              error={getFieldError(form, 'hourlyRate')}
                              label="Hourly rate"
                            />
                          )}
                        />
                        <Field
                          name="radius"
                          render={({
                            field,
                            form,
                          }: FieldProps<IFormValues>) => (
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
                        <fieldset>
                          <legend>Other information</legend>
                          <Field
                            name="general"
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
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
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
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
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
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
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
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
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
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
                            render={({
                              field,
                              form,
                            }: FieldProps<IFormValues>) => (
                              <Checkbox
                                {...field}
                                checked={field.value}
                                error={getFieldError(form, 'hasOwnEquipment')}
                                label="I have my own cleaning equipment"
                              />
                            )}
                          />
                        </fieldset>
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
          )
        }}
      </Query>
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
    if (!description) {
      errors.description = 'Please enter a description'
    } else if (description.length > maxServiceDescriptionLength) {
      errors.description = `Description is too long, please keep it under ${maxServiceDescriptionLength} characters`
    }

    if (!serviceName) {
      errors.serviceName = 'Please enter a name'
    } else if (serviceName.length > maxServiceNameLength) {
      errors.serviceName = `Name is too long, please keep it under ${maxServiceNameLength} characters`
    }

    return errors
  }
}

export default EditService
