import { FormikProps } from 'formik'

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
  { errors, submitCount, touched }: FormikProps<IFormValues>,
  prop: keyof IFormValues,
): string | undefined =>
  submitCount && touched[prop] && errors[prop]
    ? String(errors[prop])
    : undefined

export const renderDecimal = (n: number): string => n.toFixed(2)

export const renderCurrency = (n: number): string => `£${renderDecimal(n)}`

export const serviceImageUrl = (path: string): string =>
  `https://taskatron-service-images.s3.amazonaws.com/${path}`
