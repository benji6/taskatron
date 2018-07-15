import * as React from 'react'
import './style.css'

class ButtonGroup extends React.PureComponent<
  React.HTMLAttributes<HTMLDivElement>
> {
  public render() {
    return <div {...this.props} className="button-group" />
  }
}

export default ButtonGroup
