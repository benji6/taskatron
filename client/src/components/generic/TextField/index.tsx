import * as classnames from 'classnames'
import * as React from 'react'
import './style.css'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly error?: React.ReactNode
  readonly label: React.ReactNode
}

class TextField extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { label, error, ...rest } = this.props

    const inputClassName = classnames('text-field__input', {
      ['text-field__input--error']: Boolean(error),
    })

    return (
      <label className="text-field">
        <div className="text-field__label">{label}</div>
        <input type="text" {...rest} className={inputClassName} />
        {error && <div className="text-field__error">{error}</div>}
      </label>
    )
  }
}

export default TextField
