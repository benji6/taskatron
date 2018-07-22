import * as React from 'react'
import FieldError from '../privateComponents/FieldError'
import FieldLabel from '../privateComponents/FieldLabel'
import './style.css'

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: React.ReactNode
  label: React.ReactNode
}

class Select extends React.PureComponent<IProps> {
  public render() {
    const { error, label, ...rest } = this.props

    return (
      <label className="select">
        <FieldLabel>{label}</FieldLabel>
        <select
          {...this.props}
          aria-invalid={Boolean(error)}
          {...rest}
          className="select__input"
        />
        <FieldError>{error}</FieldError>
      </label>
    )
  }
}

export default Select
