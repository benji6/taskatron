import { Button, ButtonGroup, Checkbox, CurrencyField } from 'eri'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isValidNumber } from '../../../shared/validation'
import getFieldError from '../../../utils/getFieldError'

interface IFormValues {
  carpetClean: boolean
  deepClean: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  hourlyRate: string
  ovenClean: boolean
}

class Service extends React.PureComponent {
  public render() {
    return (
      <main>
        <Formik
          initialValues={{
            carpetClean: false,
            deepClean: false,
            general: false,
            hasOwnEquipment: false,
            hasOwnProducts: false,
            hourlyRate: '',
            ovenClean: false,
          }}
          onSubmit={console.log}
          validate={this.validate}
          render={({ isSubmitting }: FormikProps<IFormValues>) => (
            <Form noValidate>
              <h2>Cleaning</h2>
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
                    error={getFieldError(form, 'hasOwnEquipment')}
                    label="I have my own cleaning equipment"
                  />
                )}
              />
              <ButtonGroup>
                <Button disabled={isSubmitting}>Save</Button>
              </ButtonGroup>
              <p e-util="center">
                Have a different service to offer? Click{' '}
                <Link to="/service/gardening">here for gardening</Link> or{' '}
                <Link to="/service/ironing">here for ironing</Link>!
              </p>
            </Form>
          )}
        />
      </main>
    )
  }

  private validate = ({ hourlyRate }: IFormValues) =>
    isValidNumber(hourlyRate)
      ? undefined
      : { hourlyRate: 'Please enter a valid email address' }
}

export default Service
