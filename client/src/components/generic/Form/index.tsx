import { Form as FormikForm } from 'formik'
import * as React from 'react'
import './style.css'

class Form extends React.PureComponent<
  React.FormHTMLAttributes<HTMLFormElement>
> {
  public render() {
    return <FormikForm {...this.props} className="form" noValidate />
  }
}

export default Form
