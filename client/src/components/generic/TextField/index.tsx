import * as React from 'react'
import FieldError from '../privateComponents/FieldError'
import FieldLabel from '../privateComponents/FieldLabel'
import './style.css'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly error?: React.ReactNode
  readonly label: React.ReactNode
}

class TextField extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { label, error, ...rest } = this.props

    return (
      <label className="text-field">
        <FieldLabel>{label}</FieldLabel>
        <input
          type="text"
          {...rest}
          aria-invalid={Boolean(error)}
          className="text-field__input"
        />
        <FieldError>{error}</FieldError>
      </label>
    )
  }
}

export default TextField
