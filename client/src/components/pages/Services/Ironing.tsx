import { Button, ButtonGroup, Checkbox, CurrencyField } from 'eri'
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
import { postServiceIroning } from '../../../api'
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

class IroningService extends React.PureComponent {
  public hasUnmounted = false

  public state = {
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { submittedSuccessfully } = this.state

    return (
      <main>
        {submittedSuccessfully ? (
          <>
            <h2>Gardening service added!</h2>
            <p>
              <Link to="/services">Manage your services here</Link>.
            </p>
          </>
        ) : (
          <Formik
            initialValues={{
              bedLinen: false,
              collectAndReturn: false,
              hasOwnEquipment: false,
              hourlyRate: '',
              other: false,
              shirts: false,
              specialist: false,
              trousers: false,
            }}
            onSubmit={this.handleSubmit}
            validate={this.validate}
            render={({ isSubmitting }: FormikProps<IFormValues>) => (
              <Form noValidate>
                <h2>Ironing</h2>
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
                      error={getFieldError(form, 'specialist')}
                      label="Specialist ironing - MOA"
                    />
                  )}
                />
                <Field
                  name="hasOwnEquipment"
                  render={({ field, form }: FieldProps<IFormValues>) => (
                    <Checkbox
                      {...field}
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
                      error={getFieldError(form, 'collectAndReturn')}
                      label="Will collect, iron &amp; return"
                    />
                  )}
                />
                <ButtonGroup>
                  <Button disabled={isSubmitting}>Save</Button>
                </ButtonGroup>
                <p e-util="center">
                  Have a different service to offer? Click{' '}
                  <Link to="/services/cleaning">here for cleaning</Link> or{' '}
                  <Link to="/services/gardening">here for gardening</Link>!
                </p>
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
      await postServiceIroning({
        ...values,
        hourlyRate: Number(values.hourlyRate),
      })
      if (this.hasUnmounted) return
      actions.setSubmitting(false)
      this.setState({ submittedSuccessfully: true })
    } catch (e) {
      if (this.hasUnmounted) return
      actions.setSubmitting(false)
      this.setState({ errorCode: e.message === '400' ? 400 : 500 })
    }
  }

  private validate = ({ hourlyRate }: IFormValues) =>
    isValidNumber(hourlyRate)
      ? undefined
      : { hourlyRate: 'Please enter a valid hourly rate' }
}

export default IroningService
