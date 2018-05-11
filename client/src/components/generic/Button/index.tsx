import * as React from 'react'
import './style.css'

interface IProps {
  readonly children: React.ReactNode
  readonly disabled?: boolean
}

class Button extends React.PureComponent<IProps> {
  public render (): React.ReactNode {
    const {disabled, children} = this.props

    return (
      <button className="button" disabled={disabled}>{children}</button>
    )
  }
}

export default Button
