import * as React from 'react'
import Spinner from '../Spinner'
import './style.css'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variation?: 'primary' | 'secondary'
}

class Button extends React.PureComponent<IProps> {
  public static defaultProps = {
    variation: 'primary',
  }

  public render(): React.ReactNode {
    const {
      children,
      disabled,
      type = 'submit',
      variation,
      ...rest
    } = this.props

    const className = `button button--${variation}`

    return (
      <button {...rest} className={className} disabled={disabled} type={type}>
        {disabled ? <Spinner ground /> : children}
      </button>
    )
  }
}

export default Button
