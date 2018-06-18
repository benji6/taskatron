import * as React from 'react'
import './style.css'

interface IProps {
  children: React.ReactNode
}

class ButtonGroup extends React.PureComponent<IProps> {
  public render() {
    const { children } = this.props

    return <div className="button-group">{children}</div>
  }
}

export default ButtonGroup
