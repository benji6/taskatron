import { FormikProps } from 'formik'

export const capitalizeFirst = (s: string): string =>
  s[0].toLocaleUpperCase() + s.slice(1)

interface ISearchStringObject {
  [key: string]: unknown
}

export const createSearchString = (o: ISearchStringObject) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(o)) {
    if (value !== undefined) params.set(key, String(value))
  }

  return `?${params}`
}

export const getFieldError = <IFormValues>(
  form: FormikProps<IFormValues>,
  prop: keyof IFormValues,
): string | undefined =>
  form.touched[prop] && form.errors[prop]
    ? String(form.errors[prop])
    : undefined

export const renderDecimal = (n: number): string => n.toFixed(2)

export const renderCurrency = (n: number): string => `£${renderDecimal(n)}`
