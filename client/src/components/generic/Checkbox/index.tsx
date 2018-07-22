import * as React from 'react'
import FieldError from '../privateComponents/FieldError'
import './style.css'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: React.ReactNode
  label: React.ReactNode
}

class Checkbox extends React.PureComponent<IProps> {
  public render() {
    const { label, name, onChange, error, ...rest } = this.props

    return (
      <label htmlFor={name} className="checkbox">
        <input
          {...rest}
          aria-invalid={!!error}
          type="checkbox"
          className="checkbox__input"
          name={name}
          id={name}
          onChange={onChange}
        />
        <span className="checkbox__appearance">✓</span>
        {label}
        <FieldError>{error}</FieldError>
      </label>
    )
  }
}

export default Checkbox
