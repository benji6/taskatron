import { FormikProps } from 'formik'

export default <IFormValues>(
  form: FormikProps<IFormValues>,
  prop: keyof IFormValues,
): string | undefined =>
  form.touched[prop] && form.errors[prop]
    ? String(form.errors[prop])
    : undefined
