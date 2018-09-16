import { Button, ButtonGroup, Checkbox, CurrencyField, Spinner } from 'eri'
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
import {
  getCleaningService,
  postCleaningService,
  putServiceCleaning,
} from '../../../api'
import { IServiceCleaningDocument } from '../../../shared/types'
import { isValidNumber } from '../../../shared/validation'
import { getFieldError } from '../../../utils'

interface IFormValues {
  carpetClean: boolean
  deepClean: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: string
  ovenClean: boolean
}

interface IState {
  error: boolean
  isLoading: boolean
  service?: IServiceCleaningDocument
  submittedSuccessfully: boolean
}

class CleaningService extends React.PureComponent {
  public hasUnmounted = false

  public state: IState = {
    error: false,
    isLoading: true,
    service: undefined,
    submittedSuccessfully: false,
  }

  public async componentDidMount() {
    try {
      const service = await getCleaningService()
      this.setState({ isLoading: false, service })
    } catch {
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
      hourlyRate: service ? String(service.hourlyRate) : '',
      ovenClean: service ? service.ovenClean : false,
    }

    return (
      <main>
        {isLoading ? (
          <Spinner variation="page" />
        ) : error ? (
          <p e-util="negative">Oops, there was an error, please try again.</p>
        ) : submittedSuccessfully ? (
          <Redirect to="/services" />
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
                      label="One-off deep clean"
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
                      label="Specialist clean - carpets"
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
                      label="Specialist clean - oven"
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
    try {
      if (this.state.service) {
        await putServiceCleaning({
          ...this.state.service,
          ...values,
          hourlyRate: Number(values.hourlyRate),
        })
      } else {
        await postCleaningService({
          ...values,
          hourlyRate: Number(values.hourlyRate),
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

  private validate = ({ hourlyRate }: IFormValues) =>
    isValidNumber(hourlyRate)
      ? undefined
      : { hourlyRate: 'Please enter a valid hourly rate' }
}

export default CleaningService
