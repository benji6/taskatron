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
  getIroningService,
  postIroningService,
  putServiceIroning,
} from '../../../api'
import { IServiceIroningDocument } from '../../../shared/types'
import { isValidNumber } from '../../../shared/validation'
import getFieldError from '../../../utils/getFieldError'

interface IFormValues {
  bedLinen: boolean
  collectAndReturn: boolean
  hasOwnEquipment: boolean
  hourlyRate: string
  other: boolean
  shirts: boolean
  specialist: boolean
  trousers: boolean
}

interface IState {
  error: boolean
  isLoading: boolean
  service?: IServiceIroningDocument
  submittedSuccessfully: boolean
}

class IroningService extends React.PureComponent {
  public hasUnmounted = false

  public state: IState = {
    error: false,
    isLoading: true,
    service: undefined,
    submittedSuccessfully: false,
  }

  public async componentDidMount() {
    try {
      const service = await getIroningService()
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
      bedLinen: service ? service.bedLinen : false,
      collectAndReturn: service ? service.collectAndReturn : false,
      hasOwnEquipment: service ? service.hasOwnEquipment : false,
      hourlyRate: service ? String(service.hourlyRate) : '',
      other: service ? service.other : false,
      shirts: service ? service.shirts : false,
      specialist: service ? service.specialist : false,
      trousers: service ? service.trousers : false,
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
                <h2>{service ? 'Edit' : 'Add'} ironing service</h2>
                <p>Tell us about the ironing service you're offering.</p>
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
                  name="bedLinen"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'bedLinen')}
                      label="Bed linen"
                    />
                  )}
                />
                <Field
                  name="shirts"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'shirts')}
                      label="Shirts"
                    />
                  )}
                />
                <Field
                  name="trousers"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'trousers')}
                      label="Trousers"
                    />
                  )}
                />
                <Field
                  name="other"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'other')}
                      label="Other standard garments"
                    />
                  )}
                />
                <Field
                  name="specialist"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'specialist')}
                      label="Specialist ironing"
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
                      label="I have my own ironing equipment"
                    />
                  )}
                />
                <Field
                  name="collectAndReturn"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      error={getFieldError(form, 'collectAndReturn')}
                      label="Will collect, iron &amp; return"
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
        await putServiceIroning({
          ...this.state.service,
          ...values,
          hourlyRate: Number(values.hourlyRate),
        })
      } else {
        await postIroningService({
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

export default IroningService
