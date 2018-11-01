import {
  Button,
  ButtonGroup,
  Checkbox,
  CurrencyField,
  Select,
  Spinner,
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
import { Link, Redirect } from 'react-router-dom'
import { getUserService, postService, putService } from '../../../api'
import { radii } from '../../../shared/constants'
import { IServiceDocument } from '../../../shared/types'
import { isValidNumber } from '../../../shared/validation'
import { getFieldError, renderDecimal } from '../../../utils'

interface IFormValues {
  carpetClean: boolean
  deepClean: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: string
  ovenClean: boolean
  radius: string
  serviceName: string
}

interface IState {
  error: boolean
  isLoading: boolean
  service?: IServiceDocument
  submittedSuccessfully: boolean
}

export default class ServiceForm extends React.PureComponent {
  public hasUnmounted = false

  public state: IState = {
    error: false,
    isLoading: true,
    service: undefined,
    submittedSuccessfully: false,
  }

  public async componentDidMount() {
    try {
      const service = await getUserService()
      this.setState({ isLoading: false, service })
    } catch (e) {
      if (e.message === '404') return this.setState({ isLoading: false })
      this.setState({ error: true, isLoading: false })
    }
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { error, isLoading, service, submittedSuccessfully } = this.state

    const initialValues = {
      carpetClean: service ? service.carpetClean : false,
      deepClean: service ? service.deepClean : false,
      general: service ? service.general : false,
      hasOwnEquipment: service ? service.hasOwnEquipment : false,
      hasOwnProducts: service ? service.hasOwnProducts : false,
      hourlyRate: service ? renderDecimal(service.hourlyRate) : '',
      ovenClean: service ? service.ovenClean : false,
      radius: service ? String(service.radius) : '__initial',
      serviceName: service ? service.name : '',
    }

    return (
      <main>
        {isLoading ? (
          <Spinner variation="page" />
        ) : error ? (
          <p e-util="negative">Oops, there was an error, please try again.</p>
        ) : submittedSuccessfully ? (
          <Redirect to="/profile" />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <h2>{service ? 'Edit' : 'Add'} cleaning service</h2>
                <p>Tell us about the cleaning service you're offering.</p>
                <Field
                  name="serviceName"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <TextField
                      {...field}
                      error={getFieldError(form, 'serviceName')}
                      label="Name"
                      supportiveText="This is the name people will see in their search results, put your name or company name."
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
        )}
      </main>
    )
  }

  private handleSubmit = async (
    values: IFormValues,
    actions: FormikActions<IFormValues>,
  ) => {
    const { serviceName, ...rest } = values

    try {
      if (this.state.service) {
        await putService({
          ...this.state.service,
          ...rest,
          hourlyRate: Number(values.hourlyRate),
          name: values.serviceName,
          radius: Number(values.radius),
        })
      } else {
        await postService({
          ...rest,
          hourlyRate: Number(values.hourlyRate),
          name: values.serviceName,
          radius: Number(values.radius),
        })
      }

      if (this.hasUnmounted) return

      actions.setSubmitting(false)

      this.setState({ submittedSuccessfully: true })
    } catch (e) {
      if (this.hasUnmounted) return

      actions.setSubmitting(false)

      this.setState({ error: true })
    }
  }

  private validate = ({ hourlyRate, radius, serviceName }: IFormValues) => {
    const errors: any = {}

    if (!isValidNumber(hourlyRate)) {
      errors.hourlyRate = 'Please enter a valid hourly rate'
    }

    if (radius === '__initial') {
      errors.radius = 'Please select a radius'
    }

    if (!serviceName.length) {
      errors.serviceName = 'Please enter a name'
    }

    return errors
  }
}
