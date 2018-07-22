import * as React from 'react'
import './style.css'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

class FieldError extends React.PureComponent<IProps> {
  public render() {
    const { children, ...rest } = this.props

    return children ? (
      <div {...rest} className="field-error">
        {children}
      </div>
    ) : null
  }
}

export default FieldError
