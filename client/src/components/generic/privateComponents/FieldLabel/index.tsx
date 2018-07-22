import * as React from 'react'
import './style.css'

class FieldLabel extends React.PureComponent<
  React.HTMLAttributes<HTMLDivElement>
> {
  public render() {
    return <div {...this.props} className="field-label" />
  }
}

export default FieldLabel
