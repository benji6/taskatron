import * as React from 'react'
import './style.css'

interface IProps {
  readonly children: React.ReactNode
}

class Button extends React.PureComponent<IProps> {
  public render (): React.ReactNode {
    const {children} = this.props

    return (
      <button className="button">{children}</button>
    )
  }
}

export default Button
